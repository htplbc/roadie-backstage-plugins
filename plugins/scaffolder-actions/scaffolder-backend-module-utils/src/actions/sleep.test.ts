/*
 * Copyright 2021 Larder Software Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getVoidLogger } from '@backstage/backend-common';
import { createSleepAction } from './sleep';
import { PassThrough } from 'stream';

describe('roadiehq:utils:sleep', () => {
  const mockContext = {
    workspacePath: 'lol',
    logger: getVoidLogger(),
    logStream: new PassThrough(),
    output: jest.fn(),
    createTemporaryDirectory: jest.fn(),
  };
  const action = createSleepAction();

  it('should throw error when required parameter amount is not a number', async () => {
    await expect(
      action.handler({
        ...mockContext,
        input: {},
      }),
    ).rejects.toThrow(/amount must be a number/);
    await expect(
      action.handler({
        ...mockContext,
        input: { amount: 'alma' },
      }),
    ).rejects.toThrow(/amount must be a number/);
    await expect(
      action.handler({
        ...mockContext,
        input: { amount: {} },
      }),
    ).rejects.toThrow(/amount must be a number/);
    await expect(
      action.handler({
        ...mockContext,
        input: { amount: undefined },
      }),
    ).rejects.toThrow(/amount must be a number/);
  });
  it('should throw error when sleep amount is greater than maxSleep amount', async () => {
    const customAction = createSleepAction({ maxSleep: 1 });
    await expect(
      customAction.handler({
        ...mockContext,
        input: { amount: 2 },
      }),
    ).rejects.toThrow(/sleep amount can not be/);
  });
});
