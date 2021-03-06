var middleware = require("../middleware");
var should = require("should");
var fs = require("fs");
var path = require("path");
require("mocha-sinon");

var extendedStats = fs.readFileSync(path.join(__dirname, 'fixtures', 'stats.txt'), 'utf8');

var simpleStats = {
	hasErrors: function() {
		return false;
	},
	hasWarnings: function() {
		return false;
	}
};

describe("Reporter", function() {
	var plugins = {};
	var compiler = {
		watch: function() {
			return {};
		},
		plugin: function(name, callback) {
			plugins[name] = callback;
		}
	};
	beforeEach(function() {
		plugins = {};
		this.sinon.stub(console, 'log');
		this.sinon.stub(console, 'info');
	});

	describe("valid/invalid messages", function() {
		it("should show valid message", function(done) {
			middleware(compiler);

			plugins.done(simpleStats);
			setTimeout(function() {
				should.strictEqual(console.info.callCount, 1);
				should.strictEqual(console.info.calledWith("webpack: bundle is now VALID."), true);
				done();
			});
		});

		it("should not show valid message if options.quiet is given", function(done) {
			middleware(compiler, { quiet: true });

			plugins.done(simpleStats);
			setTimeout(function() {
				should.strictEqual(console.info.callCount, 0);
				done();
			});
		});

		it("should not show valid message if options.noInfo is given", function(done) {
			middleware(compiler, { noInfo: true });

			plugins.done(simpleStats);
			setTimeout(function() {
				should.strictEqual(console.info.callCount, 0);
				done();
			});
		});

		it("should show invalid message", function(done) {
			middleware(compiler);
			plugins.done(simpleStats);
			plugins.invalid();
			setTimeout(function() {
				should.strictEqual(console.info.callCount, 1);
				should.strictEqual(console.info.calledWith("webpack: bundle is now INVALID."), true);
				done();
			});
		});

		it("should not show invalid message if options.noInfo is given", function(done) {
			middleware(compiler, { noInfo: true });

			plugins.done(simpleStats);
			plugins.invalid();
			setTimeout(function() {
				should.strictEqual(console.info.callCount, 0);
				done();
			});
		});

		it("should not show invalid message if options.quiet is given", function(done) {
			middleware(compiler, { quiet: true });

			plugins.done(simpleStats);
			plugins.invalid();
			setTimeout(function() {
				should.strictEqual(console.info.callCount, 0);
				done();
			});
		});
	});

	describe("stats output", function() {
		var stats = {
			hasErrors: function() {
				return false;
			},
			hasWarnings: function() {
				return false;
			},
			toString: function() {
				return extendedStats;
			}
		};

		it("should print stats", function(done) {
			middleware(compiler);

			plugins.done(stats);
			setTimeout(function() {
				should.strictEqual(console.log.callCount, 1);
				should.strictEqual(console.log.calledWith(stats.toString()), true);
				done();
			});
		});

		it("should not print stats if options.stats is false", function(done) {
			middleware(compiler, { stats: false });

			plugins.done(stats);
			setTimeout(function() {
				should.strictEqual(console.log.callCount, 0);
				done();
			});
		});

		it("should not print stats if options.quiet is true", function(done) {
			middleware(compiler, { quiet: true });

			plugins.done(stats);
			setTimeout(function() {
				should.strictEqual(console.log.callCount, 0);
				done();
			});
		});

		it("should not print stats if options.noInfo is true", function(done) {
			middleware(compiler, { noInfo: true });

			plugins.done(stats);
			setTimeout(function() {
				should.strictEqual(console.log.callCount, 0);
				done();
			});
		});
	});

	describe("custom reporter", function() {
		it("should allow a custom reporter", function(done) {
			middleware(compiler, {
				reporter: function(reporterOptions) {
					should.strictEqual(reporterOptions.state, true);
					should(reporterOptions.stats).be.ok();
					should(reporterOptions.options).be.ok();
					done();
				}
			});

			plugins.done(simpleStats);
		});
	});
});
