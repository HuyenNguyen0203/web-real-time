/* eslint-disable no-await-in-loop */
const bluebird = require('bluebird');
const { v4: uuidv4 } = require('uuid')

const MAX_TRIES = 10;

const users = {};

// Random ID until the ID is not in used or max tries is reached
const randomID = async (counter = 0) => {
  if (counter > MAX_TRIES) {
    return null;
  }
  await bluebird.delay(10);
  const id = uuidv4();
  return id in users ? randomID(counter + 1) : id;
}

export const create = async (socket) => {
  const id = await randomID();
  if (id) {
    users[id] = socket;
  }
  return id;
};

export const get = (id) => users[id];

export const remove = (id) => delete users[id];
