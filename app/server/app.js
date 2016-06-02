
var express = require('express');
var xmlrpc = require('xmlrpc');
var xml2js = require('xml2js');
var _ = require('lodash');


//ignore bad certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express();

app.use('/', express.static(__dirname + '/../client/'));
app.use('/bower_components/', express.static(__dirname + '/../../bower_components/'));

app.get('/api/login', function(req, res){
	var username = req.query.username;
	var password = req.query.password;
	
	var client = xmlrpc.createSecureClient({ host: 'hn1.nubes.rl.ac.uk', port: 443, path: '/RPC2'});

	client.methodCall('one.user.login', [username + ":" + password, username, "", -1], function(error, result) {
		var isSuccess = result[0];

		if(isSuccess){
			res.json({
				sessionId: result[1]
			});
		} else {
			res.status(400).json({
				message: result[1],
				code: result[2],
			});
		}
	});
});


var machineStates = [
	'LCM_INIT',
	'PROLOG',
	'BOOT',
	'RUNNING',
	'MIGRATE',
	'SAVE_STOP',
	'SAVE_SUSPEND',
	'SAVE_MIGRATE',
	'PROLOG_MIGRATE',
	'PROLOG_RESUME',
	'EPILOG_STOP',
	'EPILOG',
	'SHUTDOWN',
	'CANCEL',
	'FAILURE',
	'CLEANUP_RESUBMIT',
	'UNKNOWN',
	'HOTPLUG',
	'SHUTDOWN_POWEROFF',
	'BOOT_UNKNOWN',
	'BOOT_POWEROFF',
	'BOOT_SUSPENDED',
	'BOOT_STOPPED',
	'CLEANUP_DELETE',
	'HOTPLUG_SNAPSHOT',
	'HOTPLUG_NIC',
	'HOTPLUG_SAVEAS',
	'HOTPLUG_SAVEAS_POWEROFF',
	'HOTPLUG_SAVEAS_SUSPENDED',
	'SHUTDOWN_UNDEPLOY',
	'EPILOG_UNDEPLOY',
	'PROLOG_UNDEPLOY',
	'BOOT_UNDEPLOY'
]


app.get('/api/machines', function(req, res){
	var username = req.query.username;
	var sessionId = req.query.sessionId;

	var client = xmlrpc.createSecureClient({ host: 'hn1.nubes.rl.ac.uk', port: 443, path: '/RPC2'});

    var args = [
    	//auth token
    	username + ":" + sessionId,
    	//show only user's VMs & groups ??
    	-1,
    	//offset for pagination	
    	0,
    	//number of entries to return
        -1,
        //VM state to filter by.
        -1
    ];


	client.methodCall('one.vmpool.info', args, function(error, result) {
		var isSuccess = result[0];

		if(isSuccess){
			xml2js.parseString(result[1], function (err, result) {
			    res.json(_.map(result.VM_POOL.VM, function(vm){
			    	return {
			    		id: parseInt(vm.ID[0]),
			    		name: vm.NAME[0],
			    		state: machineStates[parseInt(vm.STATE[0])],
			    		startTime: parseInt(vm.STIME[0]),
			    		groupName: vm.GNAME[0],
			    	}
			    }));
			});
		} else {
			res.status(400).json({
				message: result[1],
				code: result[2],
			});
		}
	});
});

app.listen(3000);