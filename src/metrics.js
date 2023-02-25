const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const { INFLUXDB_HOST, INFLUXDB_PORT, INFLUXDB_TOKEN, INFLUXDB_ORG, INFLUXDB_BUCKET, ENVIRONMENT } = require("./config");

const influxDB = new InfluxDB({
  url: `${INFLUXDB_HOST}:${INFLUXDB_PORT}`,
  token: INFLUXDB_TOKEN,
});

const writeApi = influxDB.getWriteApi(INFLUXDB_ORG, INFLUXDB_BUCKET);
writeApi.useDefaultTags({env: ENVIRONMENT});


module.exports.sendDistanceData = async function({frontLeft, frontRight, leftFront, leftBack, rightFront, rightBack}, timestamp, returnPoint) {
  const point = new Point("distance")
    .intField("frontLeft", frontLeft)
    .intField("frontRight", frontRight)
    .intField("leftFront", leftFront)
    .intField("leftBack", leftBack)
    .intField("rightFront", rightFront)
    .intField("rightBack", rightBack)
    .timestamp(timestamp || new Date())

  if (returnPoint) return point;

  writeApi.writePoint(point)
  await writeApi.close()
}


module.exports.sendPositionData = async function({position}, timestamp, returnPoint) {
  const point = new Point("position")
    .floatField("position", position)
    .timestamp(timestamp || new Date())


  if (returnPoint) return point;
  writeApi.writePoint(point)
  await writeApi.close()
}


module.exports.sendPredictionData = async function({character, chance}, timestamp, returnPoint) {
  const point = new Point("prediction")
    .stringField("character", character)
    .stringField("chance", chance)
    .timestamp(timestamp || new Date())

  if (returnPoint) return point;
  writeApi.writePoint(point)
  await writeApi.close()
}


module.exports.commandSent = async function({service, value}, timestamp, returnPoint) {
  const point = new Point("commands")
    .tag("service", service)
    .tag("direction", "outgoing")
    .stringField("value", value)
    .timestamp(timestamp || new Date())

  if (returnPoint) return point;
  writeApi.writePoint(point)
  await writeApi.close()
}


module.exports.commandResponseReceived = async function({service, value}, timestamp, returnPoint) {
  const point = new Point("commands")
    .tag("service", service)
    .tag("direction", "incoming")
    .stringField("value", value)
    .timestamp(timestamp || new Date())

  if (returnPoint) return point;
  writeApi.writePoint(point)
  await writeApi.close()
}

module.exports.sendLog = async function({message, type}, timestamp, returnPoint) {
  type = type || "info";

  const point = new Point("logs")
    .tag("type", type)
    .stringField("message", message)
    .timestamp(timestamp || new Date())

  if (returnPoint) return point;
  writeApi.writePoint(point)
  await writeApi.close()
}

module.exports.writePoints = async function(points) {
  writeApi.writePoints(points);
  await writeApi.close();
}

module.exports.writePointsAsync = async function(pointPromises) {
  const points = await Promise.all(pointPromises);
  writeApi.writePoints(points);
  await writeApi.close();
}
