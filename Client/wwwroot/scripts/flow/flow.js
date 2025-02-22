window.ffFlow = {
    active: false,
    csharp: null,
    parts: [],
    FlowLines: new ffFlowLines(),
    Mouse: new ffFlowMouse(),
    SelectedPart: null,
    SingleOutputConnection: true,
    Vertical: true,

    reset: function () {
        ffFlow.active = false;
        ffFlowPart.reset();
        this.FlowLines.reset();
        this.Mouse.reset();
    },

    unSelect: function () {
        ffFlow.SelectedPart = null;
        ffFlowPart.unselectAll();
    },

    init: function (container, csharp, parts) {
        ffFlow.csharp = csharp;
        ffFlow.parts = parts;
        if (typeof (container) === 'string') {
            let c = document.getElementById(container);
            if (!c)
                c = document.querySelector(container);
            if (!c) {
                console.warn("Failed to locate container:", container);
                return;
            }
            container = c;
        }
        container.addEventListener("touchstart", (e) => ffFlow.Mouse.dragStart(e), false);
        container.addEventListener("touchend", (e) => ffFlow.Mouse.dragEnd(e), false);
        container.addEventListener("touchmove", (e) => ffFlow.Mouse.drag(e), false);

        container.addEventListener("mousedown", (e) => ffFlow.Mouse.dragStart(e), false);
        container.addEventListener("mouseup", (e) => ffFlow.Mouse.dragEnd(e), false);
        container.addEventListener("mousemove", (e) => ffFlow.Mouse.drag(e), false);

        container.addEventListener("mouseup", (e) => ffFlow.FlowLines.ioMouseUp(e), false);
        container.addEventListener("mousemove", (e) => ffFlow.FlowLines.ioMouseMove(e), false);
        container.addEventListener("click", (e) => { ffFlow.unSelect() }, false);
        container.addEventListener("dragover", (e) => { ffFlow.drop(e, false) }, false);
        container.addEventListener("drop", (e) => { ffFlow.drop(e, true) }, false);



        let canvas = document.querySelector('canvas');

        let width = ffFlow.Vertical ? (document.body.clientWidth * 1.5) : window.screen.availWidth
        let height = ffFlow.Vertical ? (document.body.clientHeight * 2) : window.screen.availHeight;

        canvas.height = height;
        canvas.width = width;
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';

        for (let p of parts) {
            ffFlowPart.addFlowPart(p);
        }

        ffFlow.redrawLines();
    },

    redrawLines: function () {
        ffFlow.FlowLines.redrawLines();
    },


    ioInitConnections: function (connections) {
        ffFlow.reset();
        for (let k in connections) { // iterating keys so use in
            for (let con of connections[k]) { // iterating values so use of
                let id = k + '-output-' + con.output;

                let list = ffFlow.FlowLines.ioOutputConnections.get(id);
                if (!list) {
                    ffFlow.FlowLines.ioOutputConnections.set(id, []);
                    list = ffFlow.FlowLines.ioOutputConnections.get(id);
                }
                list.push({ index: con.input, part: con.inputNode });
            }

        }

        // this.ioOutputConnections.set(output, []);
        //     this.ioOutputConnections.get(output).push(input);
    },

    drop: function (event, dropping) {
        event.preventDefault();
        if (dropping !== true)
            return;
        let bounds = event.target.getBoundingClientRect();

        let xPos = event.clientX - bounds.left - 20;
        let yPos = event.clientY - bounds.top - 20;

        ffFlow.csharp.invokeMethodAsync("AddElement", ffFlow.Mouse.draggingElementUid).then(result => {
            let element = result.element;
            if (!element) {
                console.warn('element was null');
                return;
            }
            let part = {
                name: '', // new part, dont set a name
                label: element.name,
                flowElementUid: element.uid,
                type: element.type,
                xPos: xPos - 30,
                yPos: yPos,
                inputs: element.model.Inputs ? element.model.Inputs : element.inputs,
                outputs: element.model.Outputs ? element.model.Outputs : element.outputs,
                uid: result.uid,
                icon: element.icon,
                model: element.model
            };
            if (part.model?.outputs)
                part.Outputs = part.model?.outputs;

            ffFlowPart.addFlowPart(part);
            ffFlow.parts.push(part);

            if (element.model && Object.keys(element.model).length > 0)
            {
                ffFlowPart.editFlowPart(part.uid, true);
            }
        });
    },

    getModel: function () {
        console.log('getModel');
        let connections = this.FlowLines.ioOutputConnections;
        console.log('getting model, connections', connections);


        let connectionUids = [];
        for (let [outputPart, con] of connections) {
            connectionUids.push(outputPart);
            let partId = outputPart.substring(0, outputPart.indexOf('-output'));
            let output = parseInt(outputPart.substring(outputPart.lastIndexOf('-') + 1), 10);
            let part = this.parts.filter(x => x.uid === partId)[0];
            if (!part) {
                console.warn('unable to find part: ', partId);
                continue;
            }
            for (let inputCon of con) {
                let input = inputCon.index;
                let toPart = inputCon.part;
                if (!part.outputConnections)
                    part.outputConnections = [];

                if (ffFlow.SingleOutputConnection) {
                    console.log('removing output connections on output: ' + output);
                    // remove any duplciates from the output
                    part.outputConnections = part.outputConnections.filter(x => x.output != output);
                }

                part.outputConnections.push(
                    {
                        input: input,
                        output: output,
                        inputNode: toPart
                    });
            }
        }
        // remove any no longer existing connections
        for (let part of this.parts) {
            if (!part.outputConnections)
                continue;
            for (let i = part.outputConnections.length - 1; i >= 0;i--) {
                let po = part.outputConnections[i];
                let outUid = part.uid + '-output-' + po.output;
                if (connectionUids.indexOf(outUid) < 0) {
                    // need to remove it
                    part.outputConnections.splice(i, 1);
                }
            }
        }

        // update the part positions
        for (let p of this.parts) {
            var div = document.getElementById(p.uid);
            if (!div)
                continue;
            p.xPos = parseInt(div.style.left, 10);
            p.yPos = parseInt(div.style.top, 10);
        }

        console.log('model in js', this.parts);

        return this.parts;
    }
}