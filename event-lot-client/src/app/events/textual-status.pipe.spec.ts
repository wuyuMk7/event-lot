import { TextualStatusPipe } from './textual-status.pipe';

describe('TextualStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new TextualStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
