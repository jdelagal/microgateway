// © Copyright IBM Corporation 2016,2017.
// Node module: microgateway
// LICENSE: Apache 2.0, https://www.apache.org/licenses/LICENSE-2.0

'use strict';
var vm = require('vm');
var _ = require('lodash');
var fetch = require('node-fetch');
var files = require("fs"); 

function consoleProxy(log) {
  // Create a console API proxy around Bunyan-based flow logger

  /*
   logger.fatal()
   logger.error()
   logger.warn()
   logger.info()
   logger.debug()
   logger.trace()
   */

  // function fatal() {
  //  log.fatal.apply(log, arguments);
  // }

  function error() {
    log.error.apply(log, arguments);
  }

  function warn() {
    log.warn.apply(log, arguments);
  }

  function info() {
    log.info.apply(log, arguments);
  }

  // function debug() {
  //  log.debug.apply(log, arguments);
  // }

  function trace() {
    log.debug.apply(log, arguments);
  }

  return {
    // fatal: fatal,
    error: error,
    warn: warn,
    log: info,
    info: info,
    // debug: debug,
    trace: trace };
}

module.exports = function(config) {
  var javascriptPolicyHandler = function(props, context, flow) {
    var logger = flow.logger;
    logger.debug('ENTER javascript policy');
    /*
    for (var n = 0; n <= 10; n++) {
      fetch('http://192.168.99.1:8089/archibus/cxf/ReservesRm')
            .then(res => res.text())
            .then(body => console.log(body));
    }
    */
    desarrollo();

    function desarrollo() {
      console.log('ini');
      //cargar JSON
      // Defining the JSON File 

      // Getting the content from the file 
      var contenido= files.readFileSync("printVariables.json"); 

      // Definition to the JSON type 
      var jsonCont = JSON.parse(contenido);
      //verbo
      var verb = jsonCont.vrequest.verb.toLowerCase();
      console.log('verb: ',verb);

      //resource
      var resource = jsonCont.vapi.operation.path;
      console.log('resource: ',resource);

      //queremos validar que los paramatros son los que tienen que ser
      var parameters = jsonCont.vapi.document.paths[resource][verb].parameters;
      console.log('parameters: ',parameters);

      var requestParams = jsonCont.vrequest.parameters
      console.log('requestParams: ',requestParams);
      p=0;
      var respuesta = new Object;
      respuesta.nombre="respuesta";
      respuesta.campos=[];
      respuesta.campos.push("sample");
      console.log('respuesta: ',respuesta);
      for (var p in parameters) {
        if (parameters[p].required === true){
          q=0;
          var existe = false;
          var msgsKeys = Object.keys(requestParams);
          for (var q in msgsKeys) {
            if (parameters[p].name === msgsKeys[q]){
              existe=true;
              console.log(existe);
            }
          }
        }
      }
      /*
      //definition
      var definition = jsonCont.vapi.document.paths[resource][verb].responses['200'].schema.$ref;
      console.log('definition: ',definition);

      //definitionName
      var definitionName = definition.substring(definition.lastIndexOf("/") + 1, definition.length);
      console.log('definitionName: ',definitionName);

      var responseDefinition = jsonCont.vapi.document.definitions[definitionName];
      console.log('responseDefinition: ', responseDefinition);

      responseDefinition = recursiveDefinition(responseDefinition);
      */



      //responseDefinition contiene toda la definicion referente al request 200

      //Recursive definition constructor
      function recursiveDefinition(definition) {
        var definitionName;
        var responseDefinition;
        var reference;
        var propertiesNode;

        var definitionString = JSON.stringify(definition);

        //Si existen referencias continua
        if (definitionString.indexOf('$ref') > -1) {
          //Referencias en definiciones de tipo objeto
          if (definition.properties != undefined && Object.keys(definition.properties).length != 0) {
            propertiesNode = definition.properties;
            for (var p in propertiesNode) {
              //Referencias en propiedades
              if (propertiesNode[p].$ref != undefined) {
                reference = propertiesNode[p].$ref;
                definitionName = reference.substring(reference.lastIndexOf("/") + 1, reference.length);
                responseDefinition = apim.getvariable('api.document.definitions')[definitionName];
                definition = definition.properties;
                delete definition.properties;
                definition[p] = responseDefinition;

                //Busqueda de referencias en la definicion recuperada
                recursiveDefinition(definition[p]);

              //Referencias en propiedades de tipo array
              } else if (propertiesNode[p].items != undefined && propertiesNode[p].items.$ref != undefined) {
                reference = propertiesNode[p].items.$ref;
                definitionName = reference.substring(reference.lastIndexOf("/") + 1, reference.length);
                responseDefinition = apim.getvariable('api.document.definitions')[definitionName];
                delete propertiesNode[p].items;
                propertiesNode[p][definitionName] = responseDefinition;
                
                //Busqueda de referencias en la definicion recuperada
                recursiveDefinition(propertiesNode[p][definitionName]);
              }
            }
          //Referencias en definiciones de tipo array
          } else if (definition.items != undefined && definition.items.$ref != undefined) {

            reference = definition.items.$ref;
            definitionName = reference.substring(reference.lastIndexOf("/") + 1, reference.length);
            responseDefinition = apim.getvariable('api.document.definitions')[definitionName];
            delete definition.items;
            definition[definitionName] = responseDefinition;
            
            //Busqueda de referencias en la definicion recuperada
            recursiveDefinition(definition[definitionName]);
          }
        }
      }

      //fin
    }
    
    // End Recursive definition constructor
    console.log('fin');
    if (_.isUndefined(props.source) || !_.isString(props.source)) {
      flow.fail({ name: 'JavaScriptError', value: 'Invalid JavaScript code' });
      return;
    }
    // need to wrap the code snippet into a function first
    try {
      //console.log('props.source: ',typeof (props.source));
      var str = "Visit Microsoft!";
      var res = str.replace("Microsoft", "W3Schools");

      var script = new vm.Script('(function() {' + props.source + '\n})()');

      // use context as this to run the wrapped function
      // and also console for logging
      var origProto = Object.getPrototypeOf(context);
      var newProto = Object.create(origProto);
      newProto.console = consoleProxy(flow.logger);
      Object.setPrototypeOf(context, newProto);
      script.runInNewContext(context);
      Object.setPrototypeOf(context, origProto);
      logger.debug('EXIT');
      flow.proceed();
    } catch (e) {
      logger.debug('EXIT with an error:%s', e);
      if (e.name) {
        flow.fail(e);
      } else {
        flow.fail({ name: 'JavaScriptError', message: '' + e });
      }
    }
  };
  // disable param resolving
  javascriptPolicyHandler.skipParamResolving = true;
  return javascriptPolicyHandler;
};
