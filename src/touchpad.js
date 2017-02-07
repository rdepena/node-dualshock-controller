const config = require('./config');

function genpBufferFromConf(tpAxis) {
    return {
        name: tpAxis.name,
        active: false,
        data: {
            x: 0,
            y: 0
        }
    };
}

module.exports = function TouchPad(controller) {
    const touchPad = config.getControllerConfig().touchPad;
    let pBuffer = {};

    function processIsActive(buffer, tpAxis) {
        const active = buffer[tpAxis.activePin] < 128;
        const axisBuffer = pBuffer[tpAxis.name];
        const evt = active ? 'active' : 'inactive';

        if (active !== axisBuffer.active) {
            controller.emit(`touchpad:${tpAxis.name}:${evt}`);
        }

        axisBuffer.active = active;
    }

    function processData(buffer, tpAxis) {
        const axisBuffer = pBuffer[tpAxis.name];

        if (axisBuffer.active) {
            axisBuffer.data.x = ((buffer[tpAxis.dataPinA] & 15) << 8 | buffer[tpAxis.dataPinB]);
            axisBuffer.data.y = buffer[tpAxis.dataPinC] << 4 | ((buffer[tpAxis.dataPinA] & 240) >> 4);
            controller.emit(`touchpad:${tpAxis.name}`, axisBuffer.data);
        }

    }

    this.process = function process(buffer) {
        for (let i = 0; i < touchPad.length; i++) {
            //if we have not built a pBuffer profile for this axis lets build it.
            if (!pBuffer[touchPad[i].name]) {
                pBuffer[touchPad[i].name] = genpBufferFromConf(touchPad[i]);
            }

            processIsActive(buffer, touchPad[i]);
            processData(buffer, touchPad[i]);
        }
    };
};
