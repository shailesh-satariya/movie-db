const { PubSub } = require( 'apollo-server' );

const MESSAGE_EVENTS = require( './movie' );

const EVENTS = {
    MESSAGE: MESSAGE_EVENTS,
};

const pubsub = new PubSub();

module.exports = {
    pubsub,
    EVENTS
};
