const builder = require("electron-builder");

builder.build({
	config: {
		"appId": "local.test.app1",
		"mac":{
			"target": "zip",
		},
		"directories": {
			"output": "dist2",
		}
	}
});
