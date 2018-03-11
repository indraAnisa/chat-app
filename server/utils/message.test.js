var expect = require("expect");

var { generateMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    var from = 'indra';
    var text = 'this is cool';
    var message = generateMessage(from, text);

    expect(message).toMatchObject({from, text});
    expect(typeof(message.createdAt)).toBe('number');
  });
});
