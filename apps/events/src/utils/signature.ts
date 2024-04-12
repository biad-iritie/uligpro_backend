const { createHmac } = require('crypto');

export class Signature {
  constructor(private readonly secret: string) {}

  async signature(json: JSON) {
    const hmac = createHmac('sha256', this.secret);
    hmac.update(JSON.stringify(json));
    return hmac.digest('hex');
  }

  async extractS1(header: string) {
    const match = header.match(/s1=([^,]+)/);
    return match ? match[1] : null;
  }
}
