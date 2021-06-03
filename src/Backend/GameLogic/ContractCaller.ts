import { ContractFunction } from 'ethers';
import { DiagnosticUpdater } from '../Interfaces/DiagnosticUpdater';
import { ThrottledConcurrentQueue } from '../Network/ThrottledConcurrentQueue';
import { sleep } from '../Utils/Utils';

export class ContractCaller {
  private diagnosticsUpdater?: DiagnosticUpdater;
  private static readonly MAX_RETRIES = 12;
  private readonly callQueue = new ThrottledConcurrentQueue(10, 1000, 20);

  public async makeCall<T>(
    contractViewFunction: ContractFunction<T>,
    args: unknown[] = []
  ): Promise<T> {
    for (let i = 0; i < ContractCaller.MAX_RETRIES; i++) {
      try {
        return await contractViewFunction(...args);
      } catch (e) {
        await sleep(1000 * 2 ** i + Math.random() * 100);
      } finally {
        this.diagnosticsUpdater?.updateDiagnostics((d) => {
          d.totalCalls++;
        });
      }
    }

    throw new Error('failed to call contract');
  }

  public setDiagnosticUpdater(diagnosticUpdater?: DiagnosticUpdater) {
    this.diagnosticsUpdater = diagnosticUpdater;
  }
}
