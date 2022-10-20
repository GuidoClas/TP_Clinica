import { ParseDNIPipe } from './parse-dni.pipe';

describe('ParseDNIPipe', () => {
  it('create an instance', () => {
    const pipe = new ParseDNIPipe();
    expect(pipe).toBeTruthy();
  });
});
