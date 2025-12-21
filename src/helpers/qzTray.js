import qz from 'qz-tray'

class PrinterServices {

    findFunction = async () =>  {
        const printer = await qz.printers.find('goojprt')
        console.log(printer);

        // qz.websocket.connect().then(function() {
        //     alert("Connected!");
        // });
    }
}

export default PrinterServices