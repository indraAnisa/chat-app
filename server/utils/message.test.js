var expect = require("expect");

var { generateMessage, generateLocationMessage } = require("./message");

describe("generateMessage", () => {
  it("should generate correct message object", () => {
    var from = "indra";
    var text = "this is cool";
    var message = generateMessage(from, text);

    expect(message).toMatchObject({ from, text });
    expect(typeof message.createdAt).toBe("number");
  });
});

describe("generateLocationMessage", () => {
  it("should generate correct location object", () => {
    var from = "indra";
    var lat = 12;
    var lon = 1234;

    var locationMessage = generateLocationMessage(from, lat, lon);
    expect(locationMessage.from).toBe('indra');
    expect(locationMessage.url).toBe(`https://www.google.com/maps/search/${lat},${lon}`);
    expect(typeof(locationMessage.createdAt)).toBe('number');
  });
});
