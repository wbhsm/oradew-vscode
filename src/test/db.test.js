const assert = require("assert");
const db = require("../common/db");

import { getDefaultsFromSchema } from "../common/utility";

const templateDbconfig = require("./resources/dbconfig.default.json");

describe("#db getConfiguration", function() {
  it("should return default cfg", function() {
    let cfg = {
      env: "DEV",
      connectString: "localhost/orclpdb",
      user: "hr1",
      password: "welcome1",
      default: true
    };
    let cfgNonUser = db.config.getConfiguration("DEV", "XXX");
    assert.deepEqual(cfgNonUser, cfg);

    let cfgNullUser = db.config.getConfiguration("DEV");
    assert.deepEqual(cfgNullUser, cfg);
  });
});

describe("#DBConfig", function() {
  const dbconfig = db.config;
  const defaults = getDefaultsFromSchema(
    "../../resources/dbconfig-schema.json"
  );

  it("should extract defaults from schema", function() {
    assert.deepEqual(defaults, templateDbconfig);
  });

  it("should get defaults from dbConfigInstance", function() {
    assert.deepEqual(dbconfig.object, templateDbconfig);
  });

  it("should return all distinct dev users", function() {
    let users = dbconfig.getSchemas();
    assert.deepEqual(users, ["HR", "HR1"]);
  });

  // it("should return connectString", function() {
  //   let connectString = dbconfig.getConnectString("DEV");
  //   assert.deepEqual(connectString, defaults.DEV.connectString);
  // });

  // it("should return usersObjects", function() {
  //   let connectString = dbconfig.getUserObjects("DEV");
  //   assert.deepEqual(connectString, defaults.DEV.users);
  // });

  it("should get configuration from Custom file", function() {
    const dbConfigInstance1 = new db.DBConfig(
      "./src/test/resources/dbconfig.json"
    );
    let users = dbConfigInstance1.getSchemas();
    assert.deepEqual(users, ["DEV", "DEV1"]);

    let cfgDefault = {
      env: "DEV",
      connectString: "oradew",
      user: "dev1",
      password: "welcome1",
      default: true,
      disabled: false
    };
    let cfgDefaultActual = dbConfigInstance1.getConfiguration("DEV");
    assert.deepEqual(cfgDefaultActual, cfgDefault);

    // dev2 is disabled, get default
    let cfgUserActualDisabled = dbConfigInstance1.getConfiguration(
      "DEV",
      "dev2"
    );
    assert.deepEqual(cfgUserActualDisabled, cfgDefault);

    let cfgUser = {
      env: "DEV",
      connectString: "oradew",
      user: "dev",
      password: "welcome"
    };
    let cfgUserActual = dbConfigInstance1.getConfiguration("DEV", "dev");
    assert.deepEqual(cfgUserActual, cfgUser);
  });
});

// describe("#DBConfig:getSchemas", function() {

// });
