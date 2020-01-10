import { UnixTsToDatePipe } from './unix-ts-to-date.pipe';

describe('UnixTsToDatePipe', () => {
  it('create an instance', () => {
    const pipe = new UnixTsToDatePipe();
    expect(pipe).toBeTruthy();
  });
});
