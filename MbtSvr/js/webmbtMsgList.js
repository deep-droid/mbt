// copyright 2009 - 2015, TestOptimal, LLC, all rights reserved.
// webmbtMsgList.js

var gMsgList = new Array();

var msgIDE = "TestOptimal";

gMsgList["actiondelaymillis"] = {"code": "Action Delay (ms)", "desc": "Number of milliseconds (or mscript expr) to sleep after action trigger is executed. Adjust this value to accommodate your web application performance. The transition setting overrides model setting." };
gMsgList["adminusers"] = {"code": "Admin Users", "desc": "Admin users separated by semi-colon ';'." };
gMsgList["alert"] = {"code": "Alert Message", "desc": "System alert and warning message." };
gMsgList["alm.not.enabled"] = {"code": "ALM Not Enabled", "desc": "ALM plugin is not enabled for the model. Check Model property." };
gMsgList["archiveDate"] = {"code": "Archive Date", "desc": "Date when the model archive was created." };
gMsgList["archiveVersionLabel"] = {"code": "From " + msgIDE + " Ver.", "desc": "Version of " + msgIDE + " used to create this model archive." };
gMsgList["arch.model.need.svrMgr"] = {"code": "Connect to SvrMgr", "desc": "Not currently connected to SvrMgr" };
gMsgList["aut"] = {"code": "AUT Version", "desc": "AUT software version number." };
gMsgList["aut.web.connect.err"] = {"code": "AUT Connect Error", "desc": "Error connecting to AUT web page. Check ServerLog for details about the error." };
gMsgList["aut.not.started"] = {"code": "AUT Not Running", "desc": "AUT is not running."};
gMsgList["authclass"] = {"code": "Auth Class", "desc": "Authentication class that implements com.webmbt.AuthBase." };
gMsgList["authrealm"] = {"code": "Auth Realm", "desc": "Basic Http authentication realm." };
gMsgList["authusers"] = {"code": "Auth Users", "desc": "List of authorized users separated by semi-colon ';'." };
gMsgList["aut.uispy.started"] = {"code": "AUT Started", "desc": "AUT has been started" };
gMsgList["aut.uispy.stopped"] = {"code": "AUT Stopped", "desc": "AUT has been stoppted" };
gMsgList["activateType"] = {"code": "Activate Type", "desc": "How the state will be activated by incoming transitions" };
gMsgList["activateThreshold"] = {"code": "Activate Threshold", "desc": "Number of traversals of incoming transitions to activate this state." };
gMsgList["archive.submitted"] = {"code": "Deploy Submitted", "desc": "Model deploy request submitted. Depending on number of models and size of the models, this operation may take some time to complete." };
gMsgList["assertID"] = {"code": "Assert ID", "desc": "Unique id to be assigned to the defect found." };

gMsgList["firingType"] = {"code": "Trigger Trans", "desc": "Which of the outgoing transitions will be triggered when this state is activated." };

gMsgList["backup.missing"] = {"code": "No Backup", "desc": "No backup has been created for this model."};
gMsgList["backup.restore"] = {"code": "Restore from backup", "desc": "Restore to the backup taken on @@. Do you wish to continue?"};
gMsgList["backup.done"] = {"code": "Backup Taken", "desc": "The backup has been created for the model, you may restore to this backup by <b>File/Restore</b>."};
gMsgList["backup.ok2override"] = {"code": "Backup Override", "desc": "Override previous backup taken on @@?"};
gMsgList["backupDate"] = {"code": "Backup Date", "desc": "Date of last backup." };
gMsgList["borderStyle"] = {"code": "Border Style", "desc": "Border css style" };
gMsgList["borderWidth"] = {"code": "Border Width", "desc": "Border width in pixel" };
gMsgList["browser"] = {"code": "Browser Type", "desc": "Type of browser: IE, Firefox, etc." };
gMsgList["build"] = {"code": "Model Build Num", "desc": "Model build (archive) number (auto incremented)" };

gMsgList["canvasHeight"] = {"code": "Canvas Height", "desc": "Modeling canvas height in px."};
gMsgList["canvasWidth"] = {"code": "Canvas Width", "desc": "Modeling canvas width in px."};
gMsgList["catCodes"] = {"code": "Category Code(s)", "desc": "Category codes to be assigned to Runtime server, model and license key. Use semi-colon to separate multiple category codes. Category codes are used to determine the compatibility between models, Runtime servers and license keys."};
gMsgList["change.not.allowed"] = {"code": "Change Not Allowed", "desc": "Changes not allowed."};
gMsgList["change.ok2discard"] = {"code": "Change Discard", "desc": "There are pending changes in Property tab, do you wish to discard the changes?"};
gMsgList["change.save.first"] = {"code": "Change Save First", "desc": "Please save the changes first."};
gMsgList["change.saved"] = {"code": "Change Saved", "desc": "Changes have been saved."};
gMsgList["change.pending"] = {"code": "Changes Pending", "desc": "There are pending unsaved changes!"};
gMsgList["char.not.allowed"] = {"code": "Char Not Allowed", "desc": "Character @@ is not allowed for @@. Replaced it with alternative char @@"};
gMsgList["check.update.failed"] = {"code": "CheckUpdate Failed.", "desc": "CheckUpdate failed.  Please contact support for assistance."};
gMsgList["color"] = { "code": "Color", "desc": "Color for the state and transition" };
gMsgList["compile.java.done"] = { "code": "Java OK", "desc": "javaclass compiled successfully" };
gMsgList["config"] = { "code": "Config", "desc": "System configuration and license key" };
gMsgList["config.save.not.authorized"] = { "code": "Changes to Config not allowed", "desc": "Changes to configuration not authorized." };
gMsgList["config.saved"] = {"code": "Change Saved", "desc": "Config changes have been saved."};
gMsgList["copy.first"] = { "code": "Copy first", "desc": "Clipboard is empty. You must copy a state or transition to clipboard first." };
gMsgList["coverageType"] = { "code": "Coverage Type", "desc": "For Optimal sequencers only, to cover all transitions or all paths." };
gMsgList["cssStyle"] = {"code": "CSS Style", "desc": "CSS style string"};
gMsgList["curFolder"] = {"code": "Current Folder", "desc": "The folder path for the current model or new model being created."};

gMsgList["objective"] = { "code": "Objective", "desc": "Optimize on total # of traversals or on total execution elapsed time." };

gMsgList["datadesign.session.lost"] = {"code": "Lost Session", "desc": "Data set session context has changed. This is usually caused by multiple browser sessions connected to " + msgIDE + " server. Re-open data set to re-establish session context." };
gMsgList["dataset"] = {"code": "Data Set", "desc": "Data Set for the transition." };
gMsgList["DataSet.changed"] = {"code": "Changes not saved", "desc": "There are unsaved changes to the data.  You must either save or cancel the changes before further editing of datasets or mscripts." };
gMsgList["dataset.not.found"] = {"code": "Data Set not found", "desc": "Unable to find the data set file in the dataset subfolder of the model folder." };
gMsgList["dataset.datatype.mismatch"] = {"code": "DataSet dataType error", "desc": "Unable to set dataType for the dataset field, domain values specified do not match new data type." };
gMsgList["dataset.error"] = {"code": "Data Set Error", "desc": "Dataset change failed. Details of the error may be found in the ServerLog." };
gMsgList["dataset.rename.error"] = {"code": "Data Set Rename Error", "desc": "Dataset rename failed, make sure the dataset name is not already used and the dataset file is not open by another tool." };
gMsgList["dataset.set.cur.state"] = {"code": "Set field to current state", "desc": "Do you wish to change the field state to the current state?" };
gMsgList["dataset.set.cur.trans"] = {"code": "Set field to current trans", "desc": "Do you wish to change the field transition to the current transition?" };
gMsgList["ddt.fieldname.invalid"] = {"code": "Invalid DDT Field Name", "desc": "DDT field name may not include reserved chars (: | ;)?" };
gMsgList["ddt.regen.pairwise"] = {"code": "Pairwise Testing", "desc": "Do you wish to regenerate the minimum set of test cases using the Pairwise optimization algorithm?" };
gMsgList["ddt.regen.3way"] = {"code": "Pairwise Testing", "desc": "Do wish to regenerate the minimum set of test cases using the 3-way optimization algorithm?" };
gMsgList["ddt.regen.4way"] = {"code": "3Way Combinatorial Testing", "desc": "Do wish to regenerate the minimum set of test cases using the 4-way optimization algorithm?" };
gMsgList["ddt.regen.complete"] = {"code": "4Way Combinatorial Testing", "desc": "Do wish to regenerate a complete set of combinatorial permutations over all possible field values?" };
gMsgList["ddt.delete"] = {"code": "Delete Rows", "desc": "Do you wish to delete all selected rows?" };
gMsgList["ddt.field.exists"] = {"code": "DDT Field Already Exists", "desc": "Data-Driven Testing field already exists in dataset. Check the data set or use a different field name." };
gMsgList["ddt.regen.required"] = {"code": "Regen Required", "desc": "You may need to regen the data table due to changes just saved." };
gMsgList["demoApp"] = {"code": "Demo App", "desc": "You may need to adjust <b>Browser Type</b> property before running the demo models.<br><br>Changes to demo models are only saved in memory." };
gMsgList["desc"] = {"code": "Description", "desc": "Enter a description for the model" };
gMsgList["defaultAUT"] = {"code": "Check AUT", "desc": "If to check AUT when model is open." };
gMsgList["defaultvalue"] = {"code": "Default Value", "desc": "Default value for the MBT variable." };
gMsgList["delete.select.file"] = {"code": "Select File to Delete", "desc": "Please select files to delete." };
gMsgList["delete.confirm"] = {"code": "Confirm Delete", "desc": "Do you wish to delete @@?" };
gMsgList["delete.snapscreen.confirm"] = {"code": "Confirm Delete", "desc": "Do you wish to delete the selected snapscreens?" };
gMsgList["delete.stat.confirm"] = {"code": "Confirm Delete", "desc": "Do you wish to delete state @@?" };
gMsgList["delete.failed"] = {"code": "Unable to delete model", "desc": "Unable to delete the model. System deletes the model by renaming the model folder to _DELETED_*. Use Cleanup to remove all DELTED folders." };
gMsgList["delete.node.confirm"] = {"code": "Confirm Delete Node", "desc": "Deleting a node (state or transition) will result in deletion of the steps referencing this node and all its children states/transitions. Do you wish to continue?" };
gMsgList["delete.demo"] = {"code": "Delete Demo", "desc": "Demo model can not be deleted." };
gMsgList["demo.save"] = {"code": "Save not allowed in demo mode", "desc": "This is a demo server, save not allowed." };
gMsgList["delete.submodel.refd"] = {"code": "Submodel Referenced", "desc": "Submodel is referenced, can not be deleted." };
gMsgList["suppressVerify"] = {"code": "Suppress Verify", "desc": "Suppress validation failures from <b>Verify</b> triggers. Used for load testing to avoid failures caused by <b>Verify</b> triggers from stopping the execution." };
gMsgList["suppressSubmodelVerify"] = {"code": "Suppress Submodel Verify", "desc": "Suppress validation failures from submodel <b>Verify</b> triggers. Used for load testing to avoid failures caused by <b>Verify</b> triggers from stopping the execution." };
gMsgList["DelSnapScreenOnModelStart"] = {"code": "Delete SnapScreen", "desc": "Delete old snapscreen files before model execution." };

gMsgList["email"] = {"code": "Email Address", "desc": "The email address of the person the license was issued to." };
gMsgList["entrydelaymillis"] = {"code": "Entry Delay (ms)", "desc": "Number of milliseconds (or mscript expr) to sleep before onentry trigger is executed. Adjust this value to accommodate your web application performance." };
gMsgList["execnum"] = {"code": "Iterations", "desc": "Number of times to repeat model execution (iterations)." };
gMsgList["execthreadnum"] = {"code": "Threads", "desc": "Number of concurrent threads (virtual users) to execute. Must be less than or equal to Iterations." };
gMsgList["expirationdate"] = {"code": "License Expiration Date", "desc": "License expiration date." };
gMsgList["errored"] = {"code": "Errored", "desc": "Errored"};
gMsgList["event.invalid"] = {"code": "Invalid Event", "desc": "Event @@ is not a valid event for state @@"};
gMsgList["event"] = {"code": "Name", "desc": "Name of the transition or edge."};
gMsgList["exec"] = {"code": "Executing", "desc": "Executing"};
gMsgList["exec.model.changed"] = {"code": "Changes pending", "desc": "There are unsaved changes to the model."};
//gMsgList["expandSubmodel"] = {"code": "Expand Submodel", "desc": "Should model graph be generated with submodel expanded?."};
gMsgList["exec.not.paused"] = {"code": "Exec not paused", "desc": "Execution not paused. Requested action requires execution being paused."};
gMsgList["snapUI.not.state"] = {"code": "SnapUI not on state", "desc": "SnapUI can only be done on State."};
gMsgList["snapUI.done"] = {"code": "SnapUI Done", "desc": "SnapUI completed."};

gMsgList["is.executing"] = {"code": "Executing", "desc": "MBT model is executing."};
gMsgList["field.required"] = {"code": "Required Field", "desc": "Field @@ is required."};
gMsgList["field.not2contain"] = {"code": "Not to Contain", "desc": "Field @@ may not contain @@."};
gMsgList["field.value.not.numeric"] = {"code": "Not Numeric", "desc": "@@ is not a number."};
gMsgList["field.value.min"] = {"code": "Min Value", "desc": "@@ must be at least @@"};
gMsgList["field.value.max"] = {"code": "Max Value", "desc": "@@ must be no more than @@"};
gMsgList["file.missing"] = {"code": "File missing", "desc": "Please enter name of file to import."};
gMsgList["file.deleted"] = {"code": "File Deleted", "desc": "The following file(s) have been deleted: @@"};
gMsgList["file.ok2delete"] = {"code": "Delete File?", "desc": "Do you wish to delete this model: @@"};
gMsgList["file.import"] = {"code": "File Import", "desc": "To import a model, select <b>FileList</b> tab, scroll to the bottom of the list and click on <b>Browse</b> button."};
gMsgList["file.name.illegal.char"] = {"code": "File Name Invalid Char", "desc": "Filename may not contain forward or backward slash."};
gMsgList["file.mscript.corrupted"] = {"code": "mScript file corrupted", "desc": "The mScript file for this model is corrupted.  You must manually edit the mscript.xml in the model folder to correct the error."};
gMsgList["file.rename"] = {"code": "Rename Model", "desc": "Enter new name for the model" };
gMsgList["file.select.first"] = {"code": "Select a file", "desc": "Please select a file or enter a name for the file to import."};
gMsgList["filename"] = {"code": "Model Name", "desc": "Model file name." };
gMsgList["filename.template"] = {"code": "Model Name", "desc": "Please change the model file name." };
gMsgList["finalMustExit"] = {"code": "Pass-Through SubModel", "desc": "How to traverse submodel: each path exit submodel or loop until all paths exhausted. When set to Y, you may need to set Traversal Times for the incoming transition to appropriate number to ensure sub-model is fully traversed." };
gMsgList["folder.new"] = {"code": "New Folder", "desc": "New Folder: please enter folder name."};
gMsgList["subModelSequencer"] = {"code": "Sub-Model Sequencer", "desc": "Sequencer to be used for the sub-model"};
gMsgList["subModelPrefix"] = {"code": "Sub-Model Prefix", "desc": "Prefix to be added to all state ids" };

gMsgList["graph.window.noref"] = {"code": "Graph Window Error", "desc": "Graph window lost reference to main window. If you are using WebMBT Builder, please use Graph tab instead." };
gMsgList["graph.find"] = {"code": "Find State/Trans", "desc": "Find states/transitions by tag, state id or transition id." };
gMsgList["graphlayout"] = {"code": "Graph Orientation", "desc": "Sets the layout for generating graphs for the model." };
gMsgList["graphShowWeight"] = { "code": "Show Weight", "desc": "To show transition weight on graphs." };
gMsgList["guard"] = {"code": "Guard", "desc": "Guard condition, var:op val, eg. itemCount:ge 1" };
gMsgList["guardHint"] = {"code": "Guard Hint", "desc": "Hint (code) to be used to find a transition that resolves the guard. Separate list by a comma." };
gMsgList["satisfyingHint"] = {"code": "Satisfying Hint", "desc": "Hint (code) this transition can satisfy when visited. Separate list by a comma." };

gMsgList["hotsync.started"] = {"code": "HotSync Started", "desc": "HotSync has been started."};
gMsgList["hotsync.stopped"] = {"code": "HotSync Stopped", "desc": "HotSync has been stopped."};
gMsgList["hotsync.disabled.remote"] = {"code": "HotSync Stopped", "desc": "This is a remote session. HotSync is automatically disabled."};
gMsgList["hostport"] = {"code": "Server URL", "desc": "Server URL."};

gMsgList["ideAutoStart"] = {"code": "Auto Start IDE", "desc": "Automatically start IDE browser at login." };
gMsgList["ide.reset.prompt"] = {"code": "Reset IDE Layout?", "desc": "Do you wish to reset IDE screen layout?" };
gMsgList["ipaddress"] = {"code": "IP Address", "desc": "IP address of " + msgIDE + " server." };
gMsgList["isinitial"] = {"code": "Is Initial", "desc": "If this is an intial state / node. Each model and each super state/node must have one initial state/node." };
gMsgList["isfinal"] = {"code": "Is Final", "desc": "If this is a final state / node. Each model or super state/node can have at least one final state/node." };
gMsgList["import.model.open"] = {"code": "Requires Open Model", "desc": "Open an existing model or create a new model first." };
gMsgList["import.merge"] = {"code": "Merge Import with Model", "desc": "You have a model open, do you wish to merge the import file with the model?" };
gMsgList["initVars"] = {"code": "Initialize Variables", "desc": "Initialize MScript variable, e.g. var1=value1;var2=value2" };
gMsgList["issuedate"] = {"code": "License Issue Date", "desc": "Date when the license was issued." };
gMsgList["iterationdelay"] = {"code": "Iteration Delay (ms)", "desc": "Delay in number of milliseconds betweeen successive model executions (iterations) by the same thread" };
gMsgList["item.delete.confirm"] = {"code": "Delete?", "desc": "Do you wish to delete @@?" };
gMsgList["item.deleted"] = {"code": "Deleted", "desc": "@@ has been deleted." };

gMsgList["threadspreaddelay"] = {"code": "Thread Delay (ms)", "desc": "Delay in number of milliseconds betweeen thread startups" };

gMsgList["javaVersion"] = {"code": "Java Version", "desc": "Java (JVM) Version." };
gMsgList["javaclass"] = {"code": "Java Class/Groovy Script", "desc": "Full java class path or groovy script path which implements model triggers. Syntax: java:javaclass or groovy:myScript.groovy. Use semi-colon as separator to specify multiple paths." };
gMsgList["json.unknown"] = {"code": "Unkown JSON Object", "desc": "Unknown JSON object"};

gMsgList["labelOffsetLeft"] = {"code": "Label Horizontal Offset", "desc": "Horizontal offset to position the transition label, negative number to move it to the left and positive number to move it to the right"};
gMsgList["labelOffsetTop"] = {"code": "Label Vertical Offset", "desc": "Vertical offset to position the transition label, negative number to move it towards the top and positive number to move it towards the bottom"};
gMsgList["lastTestCaseRpt"] = {"code": "Test Output File", "desc": "Name of TestCase Report(SeqOut plugin) or comment output file." };
gMsgList["licType"] = {"code": "License Type", "desc": "Type of license."};
gMsgList["license.accept"] = {"code": "Accept License", "desc": "You must accept the license agreement to continue to use this software. Please reload the model to accept the license."};
gMsgList["licensekey"] = {"code": "License Key", "desc": "The license key that was issued to the specific email address and computer. License key may not be shared." };
gMsgList["licenseexception"] = {"code": "License Exception", "desc": "Exception triggered during license validation." };
gMsgList["license.invalid"] = {"code": "Invalid License", "desc": "The license is invalid or has expired." };
gMsgList["license.invalid.hostport"] = {"code": "Host/port not licensed", "desc": "Not licensed on the current host and/or port number." };
gMsgList["license.max.state.exceeded"] = {"code": "Max states exceeded.", "desc": "Maximum number of states exceeded for this edition." };
gMsgList["license.max.thread.exceeded"] = {"code": "Virtual Users Exceeded.", "desc": "Number of virtual users exceeded for this edition. Try close 'Close All' to clear any runaway execution threads." };
gMsgList["license.missing"] = {"code": "License key missing.", "desc": "License key is missing.  Please access the " + msgIDE + " IDE with the localhost url and enter your email address and the license key you received." };
gMsgList["license.email.missing"] = {"code": "Email address is missing.", "desc": "Missing email address." };
gMsgList["license.email.unknown"] = {"code": "Unknown email address.", "desc": "Email address does not match license key/edition." };
gMsgList["license.expired"] = {"code": "License expired or invalid.", "desc": "License is either expired or invalid for current release." };
gMsgList["license.sequencer.notallowed"] = {"code": "Sequencer not licensed.", "desc": "Only Random and Optimal sequencers are allowed with Community edition." };
gMsgList["license.notallowed"] = {"code": "Function not allowed.", "desc": "Requested function not allowed with Community edition." };
gMsgList["license.mismatch"] = {"code": "License Key Error", "desc": "License key does not match email address." };
gMsgList["license.need.renewal"] = {"code": "License Renewal Warning", "desc": "License key needs to be renewed in order to continue to receive updates and support." };
gMsgList["license.require.renewal"] = {"code": "License Renewal", "desc": "Current software updates require a new license key." };
gMsgList["licStatus"] = {"code": "License Status", "desc": "Current license status. If showing invalid, contact Tech Support for assistance." };
gMsgList["licEmail"] = {"code": "License Email", "desc": "Email address the license is issued to." };
gMsgList["expireDate"] = {"code": "Expiration Date", "desc": "License expiration date.  If expired, contact Tech Support for assistance." };
gMsgList["authPluginList"] = {"code": "Plugins", "desc": "Authorized plugins. Additional plugins may be purchased by contacting Tech Support" };
gMsgList["licKey"] = {"code": "License Key", "desc": "License key" };
gMsgList["edition"] = {"code": "Edition", "desc": "Licensed edition" };
gMsgList["licAck"] = {"code": "License Terms", "desc": "Check License Terms if you agree with " + msgIDE + " User License Terms." };
gMsgList["TempLicToken"] = {"code": "License Token", "desc": "Temporary license token issued by Tech Support." };
gMsgList["exceptions"] = {"code": "Exceptions", "desc": "License key exceptions." };

gMsgList["left"] = {"code": "Node Left (px)", "desc": "Node's left position in pixel" };
gMsgList["top"] = {"code": "Node Top (px)", "desc": "Node's top position in pixel" };
gMsgList["load.no.server"] = {"code": "No Runtime server for LoadTesting", "desc": "Unable to find a Runtime server to execute the model" };

gMsgList["markedRemoved"] = {"code": "Mark Removed", "desc": "Logically marking the state or transition to be removed from the model before execution." };
gMsgList["maxhistorystat"] = {"code": "History Stats", "desc": "Number of history stats to be kept for this model." };
gMsgList["maxhistorystatE"] = {"code": "Number of History Stats", "desc": "Number of history stats to be kept for this model." };
gMsgList["maxtranslog"] = {"code": "Trans Log Size", "desc": "Maximum number of transition and state traversal to be recorded in memory.  When exceeded, the oldest state and transition traversals are cleared in favor of newer ones." };
gMsgList["maxmillis"] = {"code": "Response Max (ms)", "desc": "The maximum number of milliseconds the action must complete.  Action exceeding this limit will be tallied and reported, however they do not cause any exception." };
gMsgList["maxthreadnum"] = {"code": "Max Virtual Users", "desc": "Maximum number of virtual users (threads) available." };
gMsgList["mbt"] = {"code": "MBT Config", "desc": "MBT execution configuration settings." };
gMsgList["mbt.exec.done"] = {"code": "Mbt Execution Completed", "desc": "Mbt execution @@"};
gMsgList["mbt.exec.warning"] = {"code": "Execution Alert", "desc": "Alert: @@"};
gMsgList["mbt.exec.aborted"] = {"code": "Mbt Execution Aborted", "desc": "Mbt execution stopped with error @@"};
gMsgList["method.param.too.few"] = {"code": "Method Params", "desc": "Missing parameters for mScript method" };
gMsgList["model.already.open"] = {"code": "Model Already Open", "desc": "The model is already open in another session" };

gMsgList["model.arch.deleted"] = {"code": "Model Archive Deleted", "desc": "Model archive has been deleted."};
gMsgList["model.archive.error"] = {"code": "Arch Model Open Error", "desc": "Unable to open archive model."};
gMsgList["model.archived"] = {"code": "Model Archived Created", "desc": "Model archive has been created and published to SysMgr"};
gMsgList["model.ok2delete"] = {"code": "Delete Model?", "desc": "Do you wish to delete this model?"};
gMsgList["mode"] = {"code": "Main-Model Sequencer", "desc": "Governs the manner by which test cases and steps are generated to achieve the desired coverage of transitions and paths in the model." };
gMsgList["model.archive.created"] = {"code": "Model Runtime Archive created", "desc": "Runtime archive for the model has been created.  It can be found in /temp/ folder with file extension '.mbt'."};
gMsgList["model.deleted"] = {"code": "Model Deleted", "desc": "Deleted @@."};
gMsgList["model.not.open"] = {"code": "Model not open", "desc": "No model is currently open."};
gMsgList["model.no.lock"] = {"code": "Model Not Locked", "desc": "You do not have lock on this model."};
gMsgList["model.lock.request.done"] = {"code": "Model Lock Done", "desc": "Successully acquired lock on this model. If the model has been modified by others since you opened this model, you must re-open this model to bring in those changes."};
gMsgList["model.not.found"] = {"code": "Model not found", "desc": "Unable to open the model."};
gMsgList["model.rename"] = {"code": "Rename Model", "desc": "Rename Model: change model name and click save."};
gMsgList["model.name.required"] = {"code": "Model Name Required", "desc": "Please enter a valid model name."};
gMsgList["model.exists"] = {"code": "Model Already Exists", "desc": "Model already exists."};
gMsgList["model.session.limit.exceeded"] = {"code": "Sessions Exceeded", "desc": "Maximum number of model execution sessions exceeded."};
gMsgList["model.new.change.pending"] = {"code": "Model Changes Pending", "desc": "There are pending changes to the current model in memory. Please save these changes first."};
gMsgList["model.new"] = {"code": "New Model", "desc": "New Model: please enter a name."};
gMsgList["model.play"] = {"code": "Play/Animiate", "desc": "<em>Play/Animate Model</em><br><br>Enter a delay in milliseconds:"};
gMsgList["model.not.running"] = {"code": "Model is not running", "desc": "Model is not running."};
gMsgList["model.changed"] = {"code": "Changes not saved", "desc": "There are unsaved changes to the currently opened model. Do you wish to discard the changes?"};
gMsgList["model.move.failed"] = {"code": "Unable to move model", "desc": "Unable to move model. The model is currently locked by other application."};
gMsgList["model.notselected"] = {"code": "Select a model", "desc": "No model is selected for paste/move operation."};
gMsgList["model.move.ok"] = {"code": "Model moved", "desc": "Model has been moved."};
gMsgList["model.copy.ok"] = {"code": "Model copied", "desc": "Model copy is completed."};
gMsgList["modelTreeViewSort"] = {"code": "Sort Model Tree View", "desc": "Sort states and transitions in Model Tree View."};
gMsgList["treeViewSort"] = {"code": "Model TreeView Sort", "desc": "How states and transitions are sorted."};
gMsgList["mScript.changed"] = {"code": "Changes not saved", "desc": "There are changes to the mScript. You must either accept (OK) the changes or cancel the changes before further editing other mScripts or datasets."};
gMsgList["mscriptdelaymillis"] = {"code": "Mscript Delay (ms)", "desc": "Number of milliseconds (or mscript expr) to sleep after each mscript is executed. Set/increase this value to accomodate your web app slow response." };
gMsgList["model.not.authorized"] = {"code": "Not Authorized", "desc": "Access to the selected model not authorized."};
gMsgList["model.restored"] = {"code": "Model Restored", "desc": "Model has been restored to the last backup."};
gMsgList["mScript.exec.not.paused"] = {"code": "Exec MScript", "desc": "mScript can only be executed when model execution is paused."};
gMsgList["mScript.change.not.allowed"] = {"code": "Change mScript", "desc": "Changes cannot be made to archived Model mScript."};
gMsgList["mScriptIndent"] = {"code": "MScript Indent Char#", "desc": "Number of characters to indent MScript."};
gMsgList["model.started"] = {"code": "Execution Started", "desc": "Model execution has started."};
gMsgList["model.completed"] = {"code": "Execution Completed", "desc": "Model execution has completed."};
gMsgList["mscript.comp.notallowed"] = {"code": "Compile Not Allowed", "desc": "Can not compile with unsaved changes pending."};
gMsgList["mscript.save.prev.error"] = {"code": "Unable to save mScript", "desc": "Unable to save mScript to mscript.xml due to previous parsing error. Delete mscript.xml (save a copy first) and try again. "};
gMsgList["mscript.save.extool"] = {"code": "Unable to save mScript", "desc": "Can not save mScript changes. mScript file has been changed by external tool. Rename mscript.xml file and try to save again."};
gMsgList["MScriptWrap"] = {"code": "MScript Wrap", "desc": "If to turn on word-wrapping in MScript Editor."};
gMsgList["mScriptWrapAttr"] = {"code": "MScript Auto-Format", "desc": "Auto-format MScript to separate attributes to one attribute per line."};
gMsgList["model.missing.initial"] = {"code": "Missing Initial State", "desc": "Model is missing the initial state."};
gMsgList["model.missing.final"] = {"code": "Missing Final State", "desc": "Model is missing final state(s)."};
gMsgList["model.multi.initial"] = {"code": "Too Many Initial States", "desc": "Multiple initial states found. Model can only have one initial state."};
gMsgList["modelType"] = {"code": "Model Notation", "desc": "Model type/notation: choose State Diagram (extended Finite State Machine) or Activity Diagram."};

gMsgList["name"] = {"code": "Name", "desc": "Name"};
gMsgList["not.supported"] = {"code": "Not Supported", "desc": "Not supported."};
gMsgList["numexec"] = {"code": "Number of Executions", "desc": "Number of times this MCase must be executed. Not used when this model is embedded in another model as a submodel." };

gMsgList["osName"] = {"code": "OS Name", "desc": "Operating System ." };
gMsgList["osVersion"] = {"code": "OS Version", "desc": "Operating System Version." };
gMsgList["outputComment"] = {"code": "Output Comment", "desc": "Writes mscript comments to Test Output File." };

gMsgList["parallelMode"] = {"code": "Parallel Mode", "desc": "How threads should consume test sequence: Shared to have all threads consume the same test sequence thus faster to complete execution;  Duplicate to have each thread run through the entire test sequence thus generating more load on the system."};
gMsgList["paste.invalid"] = {"code": "Invalid paste", "desc": "Unable to paste. Check node type."};
gMsgList["paused"] = {"code": "Paused", "desc": "Paused"};
gMsgList["pause.invalid"] = {"code": "Pause not allowed", "desc": "Pause action is invalid."};
gMsgList["pluginID"] = {"code": "Plugins", "desc": "Plugins enabled for the model" };
gMsgList["plugins"] = {"code": "Declare Plugins", "desc": "Declare plugins: java class names separated by semi-colon.  Optionally each plugin may have parameters separated by comma." };
gMsgList["penaltyValue"] = {"code": "Penalty For <i>Removed</i> Trans.", "desc": "Additional penalty to be applied for using transition marked Removed - applicable for Optimal and mCase sequencers only." };
gMsgList["popup.blocker"] = {"code": "Popup Blocker Enabled", "desc": "Popup blocker is preventing new window from opening." };
gMsgList["prodlevel"] = {"code": "Edition", "desc": "Product edition licensed." };
gMsgList["prompt.change"] = {"code": "Change", "desc": "Enter domain values separated by | and click OK." };
gMsgList["prompt.archive.comment"] = {"code": "Enter comment", "desc": "Enter a check in comment below:" };

gMsgList["tagUri"] = {"code": "Tag Reference", "desc": "Overrides tagURI of system config property for retrieving all requirements for this model" };
gMsgList["uiMapUri"] = {"code": "UI Map URI", "desc": "URI for UI Map" };
gMsgList["refModelList"] = {"code": "Referenced By", "desc": "Models that reference this submodel." };
gMsgList["releaseDate"] = {"code": "Release Date", "desc": "Date when the current release was published." };
gMsgList["restore.invalid"] = {"code": "Restore not valid with import file", "desc": "Can not restore an imported file." };
gMsgList["restore.confirm"] = {"code": "Ok to restore file?", "desc": "Do you wish to retore @@ from its last backup?" };
gMsgList["restore.oneFile.only"] = {"code": "Restore One File", "desc": "Restore only works with one file checked." };
gMsgList["rt.error"] = {"code": "Runtime Error", "desc": "Runtime error has occurred, check server log file for details." };
gMsgList["restore.ok"] = {"code": "Restored from backup", "desc": "The model has been restored from last backup. Close and re-open the model to see the changes." };
gMsgList["archiveModel.save.notallowed"] = {"code": "Can not change archive model", "desc": "Changes to the archived model not allowed." };
gMsgList["runtime.readonly"] = {"code": "RunTime Edition", "desc": "Change not allowed with Runtime Edition." };
gMsgList["reportindex.updated"] = {"code": "Report Index Updated", "desc": "Report index page has been updated." };
gMsgList["runtime.save.notallowed"] = {"code": "Runtime Alert", "desc": "Changes to model not allowed in Runtime edition." };

gMsgList["save.model.prompt"] = {"code": "Save Model Changes", "desc": "Enter change comment" };
gMsgList["save.model.as"] = {"code": "Save Model As", "desc": "Save current model to a new name" };
gMsgList["savePassed"] = {"code": "Save Passed Stats", "desc": "If to save all positive asserts. This may increase memory and db usage." };
gMsgList["scList"] = {"code": "ShortCut Keys", "desc": "ShortCut keys are defined with keySeq:action;keySeq:action. More info at http://testoptimal.com/wiki search for shortcut." };
gMsgList["scxml"] = {"code": "SCXML Model", "desc": "MBT Model" };
gMsgList["search.not.found"] = {"code": "No found", "desc": "No states/transitions found matching the criteria."};
gMsgList["seed"] = {"code": "Random Seed", "desc": "The seed number to initialize the random number generator used by Random Walk and Greedy Walk.  Setting it to the same number for subsequent executions will cause the test cases generated to be identical (though not guaranteed) to prior executions and thus may help reproduce exceptions experienced during debugging." };
gMsgList["select.change"] = {"code": "Select", "desc": "Choose from the dropdown list below and click OK." };
gMsgList["seqParams"] = {"code": "Sequencer Parameters", "desc": "Sequencer parameters (key=value separated by semi-colon), e.g. MaxDup=10 for PathFinder sequencer." };
gMsgList["session.exceeded"] = {"code": "Session Exceeded", "desc": "Number of sessions has exceeded the maximum number licensed." };
gMsgList["sessionnum"] = {"code": "Sessions Licensed", "desc": "Number of concurrent sessions licensed." };
gMsgList["set"] = {"code": "Set Var", "desc": "Set variable when transition is traversed, eg. itemCount:1" };
//gMsgList["shortLabel"] = {"code": "Use Short Label", "desc": "Display short transition label on graph" };
gMsgList["sleepMultiplier"] = {"code": "Sleep Multiplier", "desc": "To increase, decrease or disable sleep. e.g. enter 0.5 to reduce each $sleep() call by 50%, enter 0 to disable all $sleep() calls or 1.5 to increase each $sleep() call by 50%." };
gMsgList["snapscreen.file.notfound"] = {"code": "Screenshot not found", "desc": "Screenshot file not found." };
gMsgList["stat.select"] = {"code": "Select a stat first", "desc": "Please select a stat first."};
gMsgList["stat.save.mbt.running"] = {"code": "MBT is running, no stat save", "desc": "Stats can not be saved while Mbt is executing."};
gMsgList["step.invalid"] = {"code": "Debug step not allowed", "desc": "Step over/into is only valid when model execution is paused."};
gMsgList["step.line"] = {"code": "Step over n mScript lines", "desc": "Resume execution by moving forward n mScript lines (e.g. +3) or pause at a specific mScript line number (e.g. 17)."};
gMsgList["removeFlag"] = {"code": "Mark <i>Removed</i>", "desc": "Flag indicates if the underlying state/transition to be removed before execution."};

gMsgList["server.action.timeout"] = {"code": "Server action timed out", "desc": "The server has not responded to recent request <b>@@</b>.<br> Make sure the server is running and the machine is not overloaded."};
gMsgList["stopped"] = {"code": "Stopped", "desc": "Stopped"};
gMsgList["state"] = {"code": "State Name", "desc": "Name of the state, unique within the model."};
gMsgList["stateid"] = {"code": "Name", "desc": "Unique name for the state / node."};
gMsgList["state.id.duplicate"] = {"code": "State ID", "desc": "State identifier is already used by another state in the model."};
gMsgList["stateid.illegal"] = {"code": "Illegal State ID", "desc": "State identifier contains reserve keyword or illegal chars."};

gMsgList["state.submodel.imported"] = {"code": "State SubModel Imported", "desc": "Submodel has been imported and added to the super state. Please save the changes and re-open the model to make the changes effective."};
gMsgList["state.submodel.notimported"] = {"code": "State SubModel Imported", "desc": "Submodel has not been imported due to exceptions."};
gMsgList["stateurl"] = {"code": "Reset URL", "desc": "Current state URL, used to reset to related AUT page upon verification failure."};
gMsgList["stat.saved"] = {"code": "Stat Saved", "desc": "Test execution stats for the current run have been saved." };
gMsgList["stat.save.not-allowed"] = {"code": "Stats can not be saved", "desc": "Stats can not be saved with Community edition." };
gMsgList["stat.del.keepit"] = {"code": "Stats can not be deleted", "desc": "Please unset the keep flat for these stats." };
gMsgList["stats.publish.not.allowed"] = {"code": "Stats can not be published", "desc": "Please select a stat entry from <b>Runs</b> tab to publish." };
gMsgList["stats.published"] = {"code": "Stats published", "desc": "Stats have been published." };
gMsgList["stats.save.none"] = {"code": "Can Not Save Stats", "desc": "Either the stats is already saved no stats to save." };

gMsgList["step"] = {"code": "mCase Step", "desc": "A transition or a state collected in an mCase." };
gMsgList["stereotype"] = {"code": "Stereotype", "desc": "Stereotype, used to categorize states and transitions. Stereotype list can be customized by setting stateStereotypeList and transStererotype property in config.properties file."};

gMsgList["shufflePaths"] = {"code": "Shuffle Paths", "desc": "If to randomize the paths for each iteration."};
gMsgList["stopAtFinalOnly"] = {"code": "Stop At Final State Only", "desc": "Execution should only be stopped at the final state after the stop condition eavaluates to true."};
gMsgList["stopcoverage"] = {"code": "Stop Coverage (%)", "desc": "The transition coverage metric imposed on MBT execution, in percent, which when reached forces MBT execution to cease"};
gMsgList["stopReqCoverage"] = {"code": "Stop Req. Coverage (%)", "desc": "The requirement coverage metric imposed on MBT execution, in percent, which when reached forces MBT execution to cease"};
gMsgList["stopcount"] = {"code": "Stop Count", "desc": "The stop condition imposed on MBT execution, based on number of transitions (events) which when reached forces MBT execution to cease"};
gMsgList["stoptime"] = {"code": "Stop Time (mins)", "desc": "The maximum number of minutes allowed for the MBT execution to run regardless of the coverage." };
gMsgList["stophomeruncount"] = {"code": "Stop Path Count", "desc": "The maximum number of paths (path back to initial state) for the MBT execution to run regardless of the coverage." };
gMsgList["stopexception"] = {"code": "Stop Exceptions", "desc": "The maximum number of exceptions (failures) allowed during execution before MBT is terminated." };
gMsgList["subModel"] = {"code": "Sub Model Name", "desc": "Name of the sub model for the state." };
gMsgList["subModelFilter"] = {"code": "Sub Model Filter", "desc": "Filter sub model states and transitions by state/transition id (exact match or regular express) or stereotype. For example. mcase(mcasName); removeState(stateid); optionalState(stateid); removeTrans(transid); optionalState(tranid); traverseTimes(transid, n)." };
gMsgList["subModel.missing.initialFinal"] = {"code": "Submodel missing initial or final states", "desc": "SubModel requires one initial state and at least 1 final state."};
//gMsgList["submodelFinalState"] = {"code": "Submodel Final State", "desc": "Final state/node in the subModel to attach this transition/edge to."};
gMsgList["SvrMgrUrl"] = {"code": "Server Manager URL", "desc": "Server Manager URL, required for deploying models."};
gMsgList["sync.submitted"] = {"code": "Sync Model Submitted", "desc": "Sync Model request has been submitted. Depending on the number of models and Runtime servers involved, Sync Model may take several minutes to complete."};
gMsgList["stateFlags"] = {"code": "Show State Flags", "desc": "Flags to be shown on the state header separated by semi-colon: A - Activate Type, D - Dataset flag, R - Requirements flag, S - Stereotype, V - Set Var flag"};
gMsgList["transFlags"] = {"code": "Show Trans Flags", "desc": "Flags to be shown next to the transition labelcode separated by semi-colon: D - Dataset flag, F - Final transition flag, G - Guard flag, T - Traversals != 1, R - Requirements flag, S - Stereotype, V - SetVar flag, W - Transition Weight."};
gMsgList["showStateFlags"] = {"code": "Show State Flags", "desc": "Flags to be shown on the state header separated by semi-colon: A - Activate Type, D - Dataset flag, R - Requirements flag, S - Stereotype, V - Set Var flag. Override config setting"};
gMsgList["showTransFlags"] = {"code": "Show Trans Flags", "desc": "Flags to be shown next to the transition labelcode separated by semi-colon: D - Dataset flag, F - Final transition flag, G - Guard flag, T - Traversals != 1, R - Requirements flag, S - Stereotype, V - SetVar flag, W - Transition Weight. Override config setting."};

gMsgList["tags"] = {"code": "Tags", "desc": "Requirements tags separated by semi-colon" };
gMsgList["tags.mark"] = {"code": "Mark By Tags", "desc": "Highlight states/transitions by tags using exact match or RegExp" };
gMsgList["targetUID"] = {"code": "Target", "desc": "Target state/node of the transition/edge." };
gMsgList["template"] = {"code": "Model Template", "desc": "Template model to clone to create the new model"};
gMsgList["TestOptimalVersion"] = {"code": "Server Ver.", "desc": "Current server version." };
gMsgList["traverses"] = {"code": "Traversals Required", "desc": "The minimum number of times this transition must be traversed." };
gMsgList["tab.not.ready"] = {"code": "Tab not ready", "desc": "Selected tab is not ready." };
gMsgList["tag.uri.invalid"] = {"code": "Invalid Tag URI", "desc": "Invalid Tag Reference." };
gMsgList["textColor"] = { "code": "Text Color", "desc": "Color for the state name." };
gMsgList["trigger.add"] = { "code": "Add Trigger", "desc": "Add a user defined trigger to the current state/transition context" };
gMsgList["trigger.delete"] = { "code": "Delete Trigger", "desc": "Do you wish to delete the current trigger?" };
gMsgList["testPathGraphType"] = { "code": "Test Path Graph Type", "desc": "Type of graph to be used to show test path: MSC or FSM?" };
gMsgList["traverseTimes"] = { "code": "Traverse Times", "desc": "Number of times the transition must be traversed." };

gMsgList["uid"] = {"code": "UID", "desc": "Unique id for each scxml (model) node"};
gMsgList["url"] = {"code": "AUT URL/File Path", "desc": "URL / file path for the Application Under Test (AUT).  Do not use back slash, use forward slash '/' instead." };
gMsgList["uri.invalid"] = {"code": "Invalid URI", "desc": "Invalid URI value in UI Map, Tag Reference or dataset." };
gMsgList["url.missing"] = {"code": "AUT URL Missing", "desc": "AUT URL is missing." };
gMsgList["stateUrl"] = {"code": "State URL", "desc": "The state (AUT page) URL to be used when the AUT page fails to load during tesing." };
gMsgList["usecasename"] = {"code": "UseCase Name", "desc": "Name of the Use Case." };
gMsgList["usecase"] = {"code": "mCase", "desc": "A collection of states and transition to form logical test case(s)." };

gMsgList["tagVrsn"] = {"code": "Req. Version", "desc": "Version number of the requirements specification." };
gMsgList["transition"] = {"code": "Transition", "desc": "A transition that represents a link or button on an AUT page (model state)." };

gMsgList["updates.available"] = {"code": "Updates Available", "desc": "Updates available, use <b>Apply Updates</b> in System Tray Console to install the updates."};

gMsgList["vrsn"] = {"code": "Model Version", "desc": "Model version number." };
gMsgList["versionTO"] = {"code": "From Server Ver.", "desc": "Version of " + msgIDE + " this model was last updated with." };

gMsgList["webmbt.state.not.allowed"] = {"code": "Not in state context", "desc": "Must be in state/scxml context to add a new state." };
gMsgList["webmbt.trans.not.allowed"] = {"code": "Not in state context", "desc": "Must be in state context to add a new transition." };
gMsgList["weight"] = {"code": "Weight", "desc": "The weight assigned to this transition to determine the probablity this transition may be chosen among other transitions originating from the same state during the random and greed walk.  A higher value assigned in relation to other transition weights will cause this transition to be chosen relatively more often." };
gMsgList["webplugin.ambiguous"] = {"code": "Web plugin error", "desc": "You have selected both Selenium and HtmlUnit. Please de-select one." };

gMsgList["ddt.no.cur.trans"] = {"code": "No trans selected", "desc": "DDT action requires a transition context." };

gMsgList["width"] = {"code": "Node Width (px)", "desc": "Width of state node." };
gMsgList["height"] = {"code": "Node Height (px)", "desc": "Height of state node." };
gMsgList["startFract"] = {"code": "Trans Start Pos", "desc": "Percentage of side of source state node to start the transition (0.0 - 1.0)." };
gMsgList["midFract"] = {"code": "Trans Mid Pos", "desc": "Percentage of mid segment of the transition (0.0 - 1.0)." };
gMsgList["endFract"] = {"code": "Trans End Pos", "desc": "Percentage of the side of target state node to end the transition (0.0 - 1.0)." };

gMsgList["startscript"] = {"code": "Start Trigger", "desc": "Trigger called at the start of model execution."};
gMsgList["stateinit"] = {"code": "State Init", "desc": "Trigger for all states called during execution initialization, once for each state."};
gMsgList["transinit"] = {"code": "Trans Init", "desc": "Trigger for all transitions called during execution initialization, once per transiion."};

gMsgList["mcasesetup"] = {"code": "Setup Trigger", "desc": "Trigger called at the start of an mCase, executed once per mCase execution."};

gMsgList["onstateentryscript"] = {"code": "State Entry Trigger", "desc": "Trigger for all states, executed before each state OnEntry Trigger." };
gMsgList["onentry"] = {"code": "OnEntry Trigger", "desc": "Trigger called upon entering this state." };

gMsgList["prepscriptstep"] = {"code": "Override Prep Trigger", "desc": "Overrides transition Prep Trigger." };
gMsgList["prepscript"] = {"code": "Prep Trigger", "desc": "Trigger to prepare transition for Action Trigger,  executed after OnExit Trigger of transition's source state." };
gMsgList["ontransprepscript"] = {"code": "Trans Prep", "desc": "Prep trigger for all transitions, executed before transition Prep Trigger." };

gMsgList["ontransactionscript"] = {"code": "Trans Action", "desc": "Action trigger for all transitions, executed before transition Action Trigger." };
gMsgList["eventscript"] = {"code": "Action Trigger", "desc": "Trigger called to perform action for the transition, executed between Prep Trigger and Verify Trigger." };
gMsgList["eventscriptstep"] = {"code": "Override Action Trigger", "desc": "Overrides transition Action Trigger." };

gMsgList["verifyscriptstep"] = {"code": "Override Verify Trigger", "desc": "Overrides transition Veify Trigger." };
gMsgList["ontransverifyscript"] = {"code": "Trans Verify", "desc": "Verify trigger for all transitions, executed before transition Verify Trigger." };
gMsgList["verifyscript"] = {"code": "Verify Trigger", "desc": "Trigger called to perform validation, executed after Action Trigger and before target state OnEntry Trigger." };

gMsgList["onstateexitscript"] = {"code": "State Exit Trigger", "desc": "Trigger for all states, executed before state OnExit Trigger." };
gMsgList["onexit"] = {"code": "OnExit Trigger", "desc": "Trigger called before exiting the state." };

gMsgList["mcasecleanup"] = {"code": "Teardown Trigger", "desc": "Trigger called at the start of an mCase, executed once per mCase."};
gMsgList["endscript"] = {"code": "End Trigger", "desc": "Trigger called at the end of model execution."};

gMsgList["exceptionscript"] = {"code": "Fail Trigger", "desc": "Trigger called on each validation failure during model execution." };
gMsgList["errorscript"] = {"code": "Error Trigger", "desc": "Trigger called on each runtime error." };

gMsgList["swimlaneName"] = {"code": "Set Name", "desc": "Swimlane set description." };
gMsgList["swimlaneCssStyle"] = {"code": "CSS Style", "desc": "Html CSS style to be applied to the swimlane element, e.g. \"background-color: orange;\"" };
gMsgList["laneLabels"] = {"code": "Lane Label List", "desc": "List of labels for the lanes separated by semi-colon. Example: lane 1, lane 2, lane 3" };
gMsgList["swimlaneOrient"] = {"code": "Orientation", "desc": "Swimlane orientation: Horizontal or Vertical" };


function resolveMsg (msgID_p) {
	return gMsgList[msgID_p];
}

function translateMsg (msgKey_p, token1_p, token2_p, token3_p, token4_p, token5_p) {
	var transMsg = gMsgList[msgKey_p];
	if (transMsg==undefined) return msgKey_p; //return decodeURIComponent(msgKey_p);
	transMsg = transMsg.desc;
	if (token1_p==undefined) return transMsg; //decodeURIComponent(transMsg);
	transMsg = transMsg.replace("@@", token1_p);

	if (token2_p==undefined) return transMsg; //decodeURIComponent(transMsg);
	transMsg = transMsg.replace("@@", token2_p);

	if (token3_p==undefined) return transMsg; //decodeURIComponent(transMsg);
	transMsg = transMsg.replace("@@", token3_p);

	if (token4_p==undefined) return transMsg; //decodeURIComponent(transMsg);
	transMsg = transMsg.replace("@@", token4_p);

	if (token5_p==undefined) return transMsg; //decodeURIComponent(transMsg);
	transMsg = transMsg.replace("@@", token5_p);
	
	return transMsg; //decodeURIComponent(transMsg);
	
}

function containsTransMessages() {
	if (gMsgList==undefined) return false;
	for (msgKey in gMsgList) {
		return true;
	}
	return false;
}



var ActivityDiagramMsgList = {
	"State": "Node",
	"Transition": "Edge",
	"State Init": "Node Init",
	"State OnEntry": "Node Prep",
	"State Action": "Node Action",
	"State OnExit": "Node Verify",
	"Trans Init": "Edge Init",
	"Trans Prep": "Edge Prep",
	"Trans Action": "Edge Action",
	"Trans Verify": "Edge Verify"
}

function resolveSysMsg (msg_p) {
	if (curAppState.nodeDataList["scxml"].modelType=="FSM") {
		return msg_p;
	}
	
	var ret = ActivityDiagramMsgList[msg_p];
	
	if (ret) return ret;
	else return msg_p;
}

function isModelCFG() {
	return curAppState.nodeDataList["scxml"].modelType=="CFG";
}

function isModelFSM() {
	return curAppState.nodeDataList["scxml"].modelType=="FSM";
}

function isMBBA() {
	return curAppState.realEdition=="MBBA";
}
