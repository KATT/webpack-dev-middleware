var should = require("should");
var middleware = require("../middleware");

var fakeWebpack = function() {
	return {
		watch: function() {
			return {};
		},
		plugin: function() {}
	};
};

describe("FileSystem", function() {
	it("should set outputFileSystem on compiler", function() {
		var compiler = fakeWebpack();
		middleware(compiler);
		should(compiler.outputFileSystem).be.ok();
	});

	it("should reuse outputFileSystem from compiler", function() {
		var compiler = fakeWebpack();
		middleware(compiler);
		var firstFs = compiler.outputFileSystem;
		middleware(compiler);
		var secondFs = compiler.outputFileSystem;

		should.strictEqual(firstFs, secondFs);
	});
});
