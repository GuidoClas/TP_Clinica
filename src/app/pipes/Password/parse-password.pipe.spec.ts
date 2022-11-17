import { ParsePasswordPipe } from './parse-password.pipe';

describe('ParsePasswordPipe', () => {
  it('create an instance', () => {
    const pipe = new ParsePasswordPipe();
    expect(pipe).toBeTruthy();
  });
});
