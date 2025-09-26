/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 181:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 212:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ isSerializableHeaderValue)
/* harmony export */ });
const isSerializableHeaderValue = (value) => {
    return value != null;
};


/***/ }),

/***/ 244:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ setCredentialFeature)
/* harmony export */ });
function setCredentialFeature(credentials, feature, value) {
    if (!credentials.$source) {
        credentials.$source = {};
    }
    credentials.$source[feature] = value;
    return credentials;
}


/***/ }),

/***/ 290:
/***/ ((module) => {

module.exports = require("async_hooks");

/***/ }),

/***/ 468:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ customEndpointFunctions)
/* harmony export */ });
const customEndpointFunctions = {};


/***/ }),

/***/ 589:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $H: () => (/* binding */ slurpFile),
/* harmony export */   Jj: () => (/* binding */ fileIntercept)
/* harmony export */ });
/* unused harmony export filePromisesHash */
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9896);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);

const { readFile } = fs__WEBPACK_IMPORTED_MODULE_0__.promises;
const filePromisesHash = {};
const fileIntercept = {};
const slurpFile = (path, options) => {
    if (fileIntercept[path] !== undefined) {
        return fileIntercept[path];
    }
    if (!filePromisesHash[path] || options?.ignoreCache) {
        filePromisesHash[path] = readFile(path, "utf8");
    }
    return filePromisesHash[path];
};


/***/ }),

/***/ 612:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ DefaultIdentityProviderConfig)
/* harmony export */ });
class DefaultIdentityProviderConfig {
    constructor(config) {
        this.authSchemes = new Map();
        for (const [key, value] of Object.entries(config)) {
            if (value !== undefined) {
                this.authSchemes.set(key, value);
            }
        }
    }
    getIdentityProvider(schemeId) {
        return this.authSchemes.get(schemeId);
    }
}


/***/ }),

/***/ 643:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  UF: () => (/* reexport */ awsEndpointFunctions),
  vL: () => (/* reexport */ getUserAgentPrefix)
});

// UNUSED EXPORTS: EndpointError, isIpAddress, partition, resolveDefaultAwsRegionalEndpointsConfig, resolveEndpoint, setPartitionInfo, toEndpointV1, useDefaultPartitionInfo

// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/utils/customEndpointFunctions.js
var customEndpointFunctions = __webpack_require__(468);
// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/lib/isValidHostLabel.js
var isValidHostLabel = __webpack_require__(8883);
// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/lib/isIpAddress.js
var isIpAddress = __webpack_require__(1466);
;// ./node_modules/@aws-sdk/util-endpoints/dist-es/lib/isIpAddress.js


;// ./node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/isVirtualHostableS3Bucket.js


const isVirtualHostableS3Bucket = (value, allowSubDomains = false) => {
    if (allowSubDomains) {
        for (const label of value.split(".")) {
            if (!isVirtualHostableS3Bucket(label)) {
                return false;
            }
        }
        return true;
    }
    if (!(0,isValidHostLabel/* isValidHostLabel */.X)(value)) {
        return false;
    }
    if (value.length < 3 || value.length > 63) {
        return false;
    }
    if (value !== value.toLowerCase()) {
        return false;
    }
    if ((0,isIpAddress/* isIpAddress */.o)(value)) {
        return false;
    }
    return true;
};

;// ./node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/parseArn.js
const ARN_DELIMITER = ":";
const RESOURCE_DELIMITER = "/";
const parseArn = (value) => {
    const segments = value.split(ARN_DELIMITER);
    if (segments.length < 6)
        return null;
    const [arn, partition, service, region, accountId, ...resourcePath] = segments;
    if (arn !== "arn" || partition === "" || service === "" || resourcePath.join(ARN_DELIMITER) === "")
        return null;
    const resourceId = resourcePath.map((resource) => resource.split(RESOURCE_DELIMITER)).flat();
    return {
        partition,
        service,
        region,
        accountId,
        resourceId,
    };
};

;// ./node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partitions.json
const partitions_namespaceObject = /*#__PURE__*/JSON.parse('{"partitions":[{"id":"aws","outputs":{"dnsSuffix":"amazonaws.com","dualStackDnsSuffix":"api.aws","implicitGlobalRegion":"us-east-1","name":"aws","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^(us|eu|ap|sa|ca|me|af|il|mx)\\\\-\\\\w+\\\\-\\\\d+$","regions":{"af-south-1":{"description":"Africa (Cape Town)"},"ap-east-1":{"description":"Asia Pacific (Hong Kong)"},"ap-east-2":{"description":"Asia Pacific (Taipei)"},"ap-northeast-1":{"description":"Asia Pacific (Tokyo)"},"ap-northeast-2":{"description":"Asia Pacific (Seoul)"},"ap-northeast-3":{"description":"Asia Pacific (Osaka)"},"ap-south-1":{"description":"Asia Pacific (Mumbai)"},"ap-south-2":{"description":"Asia Pacific (Hyderabad)"},"ap-southeast-1":{"description":"Asia Pacific (Singapore)"},"ap-southeast-2":{"description":"Asia Pacific (Sydney)"},"ap-southeast-3":{"description":"Asia Pacific (Jakarta)"},"ap-southeast-4":{"description":"Asia Pacific (Melbourne)"},"ap-southeast-5":{"description":"Asia Pacific (Malaysia)"},"ap-southeast-6":{"description":"Asia Pacific (New Zealand)"},"ap-southeast-7":{"description":"Asia Pacific (Thailand)"},"aws-global":{"description":"aws global region"},"ca-central-1":{"description":"Canada (Central)"},"ca-west-1":{"description":"Canada West (Calgary)"},"eu-central-1":{"description":"Europe (Frankfurt)"},"eu-central-2":{"description":"Europe (Zurich)"},"eu-north-1":{"description":"Europe (Stockholm)"},"eu-south-1":{"description":"Europe (Milan)"},"eu-south-2":{"description":"Europe (Spain)"},"eu-west-1":{"description":"Europe (Ireland)"},"eu-west-2":{"description":"Europe (London)"},"eu-west-3":{"description":"Europe (Paris)"},"il-central-1":{"description":"Israel (Tel Aviv)"},"me-central-1":{"description":"Middle East (UAE)"},"me-south-1":{"description":"Middle East (Bahrain)"},"mx-central-1":{"description":"Mexico (Central)"},"sa-east-1":{"description":"South America (Sao Paulo)"},"us-east-1":{"description":"US East (N. Virginia)"},"us-east-2":{"description":"US East (Ohio)"},"us-west-1":{"description":"US West (N. California)"},"us-west-2":{"description":"US West (Oregon)"}}},{"id":"aws-cn","outputs":{"dnsSuffix":"amazonaws.com.cn","dualStackDnsSuffix":"api.amazonwebservices.com.cn","implicitGlobalRegion":"cn-northwest-1","name":"aws-cn","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^cn\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-cn-global":{"description":"aws-cn global region"},"cn-north-1":{"description":"China (Beijing)"},"cn-northwest-1":{"description":"China (Ningxia)"}}},{"id":"aws-eusc","outputs":{"dnsSuffix":"amazonaws.eu","dualStackDnsSuffix":"api.amazonwebservices.eu","implicitGlobalRegion":"eusc-de-east-1","name":"aws-eusc","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^eusc\\\\-(de)\\\\-\\\\w+\\\\-\\\\d+$","regions":{"eusc-de-east-1":{"description":"EU (Germany)"}}},{"id":"aws-iso","outputs":{"dnsSuffix":"c2s.ic.gov","dualStackDnsSuffix":"api.aws.ic.gov","implicitGlobalRegion":"us-iso-east-1","name":"aws-iso","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^us\\\\-iso\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-iso-global":{"description":"aws-iso global region"},"us-iso-east-1":{"description":"US ISO East"},"us-iso-west-1":{"description":"US ISO WEST"}}},{"id":"aws-iso-b","outputs":{"dnsSuffix":"sc2s.sgov.gov","dualStackDnsSuffix":"api.aws.scloud","implicitGlobalRegion":"us-isob-east-1","name":"aws-iso-b","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^us\\\\-isob\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-iso-b-global":{"description":"aws-iso-b global region"},"us-isob-east-1":{"description":"US ISOB East (Ohio)"}}},{"id":"aws-iso-e","outputs":{"dnsSuffix":"cloud.adc-e.uk","dualStackDnsSuffix":"api.cloud-aws.adc-e.uk","implicitGlobalRegion":"eu-isoe-west-1","name":"aws-iso-e","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^eu\\\\-isoe\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-iso-e-global":{"description":"aws-iso-e global region"},"eu-isoe-west-1":{"description":"EU ISOE West"}}},{"id":"aws-iso-f","outputs":{"dnsSuffix":"csp.hci.ic.gov","dualStackDnsSuffix":"api.aws.hci.ic.gov","implicitGlobalRegion":"us-isof-south-1","name":"aws-iso-f","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^us\\\\-isof\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-iso-f-global":{"description":"aws-iso-f global region"},"us-isof-east-1":{"description":"US ISOF EAST"},"us-isof-south-1":{"description":"US ISOF SOUTH"}}},{"id":"aws-us-gov","outputs":{"dnsSuffix":"amazonaws.com","dualStackDnsSuffix":"api.aws","implicitGlobalRegion":"us-gov-west-1","name":"aws-us-gov","supportsDualStack":true,"supportsFIPS":true},"regionRegex":"^us\\\\-gov\\\\-\\\\w+\\\\-\\\\d+$","regions":{"aws-us-gov-global":{"description":"aws-us-gov global region"},"us-gov-east-1":{"description":"AWS GovCloud (US-East)"},"us-gov-west-1":{"description":"AWS GovCloud (US-West)"}}}],"version":"1.1"}');
;// ./node_modules/@aws-sdk/util-endpoints/dist-es/lib/aws/partition.js

let selectedPartitionsInfo = partitions_namespaceObject;
let selectedUserAgentPrefix = "";
const partition = (value) => {
    const { partitions } = selectedPartitionsInfo;
    for (const partition of partitions) {
        const { regions, outputs } = partition;
        for (const [region, regionData] of Object.entries(regions)) {
            if (region === value) {
                return {
                    ...outputs,
                    ...regionData,
                };
            }
        }
    }
    for (const partition of partitions) {
        const { regionRegex, outputs } = partition;
        if (new RegExp(regionRegex).test(value)) {
            return {
                ...outputs,
            };
        }
    }
    const DEFAULT_PARTITION = partitions.find((partition) => partition.id === "aws");
    if (!DEFAULT_PARTITION) {
        throw new Error("Provided region was not found in the partition array or regex," +
            " and default partition with id 'aws' doesn't exist.");
    }
    return {
        ...DEFAULT_PARTITION.outputs,
    };
};
const setPartitionInfo = (partitionsInfo, userAgentPrefix = "") => {
    selectedPartitionsInfo = partitionsInfo;
    selectedUserAgentPrefix = userAgentPrefix;
};
const useDefaultPartitionInfo = () => {
    setPartitionInfo(partitionsInfo, "");
};
const getUserAgentPrefix = () => selectedUserAgentPrefix;

;// ./node_modules/@aws-sdk/util-endpoints/dist-es/aws.js




const awsEndpointFunctions = {
    isVirtualHostableS3Bucket: isVirtualHostableS3Bucket,
    parseArn: parseArn,
    partition: partition,
};
customEndpointFunctions/* customEndpointFunctions */.m.aws = awsEndpointFunctions;

;// ./node_modules/@aws-sdk/util-endpoints/dist-es/resolveDefaultAwsRegionalEndpointsConfig.js

const resolveDefaultAwsRegionalEndpointsConfig = (input) => {
    if (typeof input.endpointProvider !== "function") {
        throw new Error("@aws-sdk/util-endpoint - endpointProvider and endpoint missing in config for this client.");
    }
    const { endpoint } = input;
    if (endpoint === undefined) {
        input.endpoint = async () => {
            return toEndpointV1(input.endpointProvider({
                Region: typeof input.region === "function" ? await input.region() : input.region,
                UseDualStack: typeof input.useDualstackEndpoint === "function"
                    ? await input.useDualstackEndpoint()
                    : input.useDualstackEndpoint,
                UseFIPS: typeof input.useFipsEndpoint === "function" ? await input.useFipsEndpoint() : input.useFipsEndpoint,
                Endpoint: undefined,
            }, { logger: input.logger }));
        };
    }
    return input;
};
const toEndpointV1 = (endpoint) => parseUrl(endpoint.url);

;// ./node_modules/@aws-sdk/util-endpoints/dist-es/resolveEndpoint.js


;// ./node_modules/@aws-sdk/util-endpoints/dist-es/types/EndpointError.js


;// ./node_modules/@aws-sdk/util-endpoints/dist-es/types/EndpointRuleObject.js


;// ./node_modules/@aws-sdk/util-endpoints/dist-es/types/ErrorRuleObject.js


;// ./node_modules/@aws-sdk/util-endpoints/dist-es/types/RuleSetObject.js


;// ./node_modules/@aws-sdk/util-endpoints/dist-es/types/TreeRuleObject.js


;// ./node_modules/@aws-sdk/util-endpoints/dist-es/types/shared.js


;// ./node_modules/@aws-sdk/util-endpoints/dist-es/types/index.js







;// ./node_modules/@aws-sdk/util-endpoints/dist-es/index.js








/***/ }),

/***/ 649:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   vK: () => (/* binding */ getContentLengthPlugin)
/* harmony export */ });
/* unused harmony exports contentLengthMiddleware, contentLengthMiddlewareOptions */
/* harmony import */ var _smithy_protocol_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7324);

const CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
    return (next) => async (args) => {
        const request = args.request;
        if (_smithy_protocol_http__WEBPACK_IMPORTED_MODULE_0__/* .HttpRequest */ .K.isInstance(request)) {
            const { body, headers } = request;
            if (body &&
                Object.keys(headers)
                    .map((str) => str.toLowerCase())
                    .indexOf(CONTENT_LENGTH_HEADER) === -1) {
                try {
                    const length = bodyLengthChecker(body);
                    request.headers = {
                        ...request.headers,
                        [CONTENT_LENGTH_HEADER]: String(length),
                    };
                }
                catch (error) {
                }
            }
        }
        return next({
            ...args,
            request,
        });
    };
}
const contentLengthMiddlewareOptions = {
    step: "build",
    tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
    name: "contentLengthMiddleware",
    override: true,
};
const getContentLengthPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), contentLengthMiddlewareOptions);
    },
});


/***/ }),

/***/ 666:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   l: () => (/* binding */ loadConfigsForDefaultMode)
/* harmony export */ });
const loadConfigsForDefaultMode = (mode) => {
    switch (mode) {
        case "standard":
            return {
                retryMode: "standard",
                connectionTimeout: 3100,
            };
        case "in-region":
            return {
                retryMode: "standard",
                connectionTimeout: 1100,
            };
        case "cross-region":
            return {
                retryMode: "standard",
                connectionTimeout: 3100,
            };
        case "mobile":
            return {
                retryMode: "standard",
                connectionTimeout: 30000,
            };
        default:
            return {};
    }
};


/***/ }),

/***/ 857:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 1071:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  P: () => (/* binding */ collectBody)
});

// EXTERNAL MODULE: ./node_modules/@smithy/util-base64/dist-es/toBase64.js
var toBase64 = __webpack_require__(9718);
// EXTERNAL MODULE: ./node_modules/@smithy/util-base64/dist-es/fromBase64.js
var fromBase64 = __webpack_require__(1395);
// EXTERNAL MODULE: ./node_modules/@smithy/util-utf8/dist-es/toUtf8.js
var toUtf8 = __webpack_require__(7638);
// EXTERNAL MODULE: ./node_modules/@smithy/util-utf8/dist-es/fromUtf8.js
var fromUtf8 = __webpack_require__(7459);
;// ./node_modules/@smithy/util-stream/dist-es/blob/transforms.js



function transformToString(payload, encoding = "utf-8") {
    if (encoding === "base64") {
        return (0,toBase64/* toBase64 */.n)(payload);
    }
    return (0,toUtf8/* toUtf8 */.P)(payload);
}
function transformFromString(str, encoding) {
    if (encoding === "base64") {
        return Uint8ArrayBlobAdapter.mutate((0,fromBase64/* fromBase64 */.E)(str));
    }
    return Uint8ArrayBlobAdapter.mutate((0,fromUtf8/* fromUtf8 */.a)(str));
}

;// ./node_modules/@smithy/util-stream/dist-es/blob/Uint8ArrayBlobAdapter.js

class Uint8ArrayBlobAdapter extends Uint8Array {
    static fromString(source, encoding = "utf-8") {
        switch (typeof source) {
            case "string":
                return transformFromString(source, encoding);
            default:
                throw new Error(`Unsupported conversion from ${typeof source} to Uint8ArrayBlobAdapter.`);
        }
    }
    static mutate(source) {
        Object.setPrototypeOf(source, Uint8ArrayBlobAdapter.prototype);
        return source;
    }
    transformToString(encoding = "utf-8") {
        return transformToString(this, encoding);
    }
}

;// ./node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js

const collectBody = async (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Uint8ArrayBlobAdapter.mutate(streamBody);
    }
    if (!streamBody) {
        return Uint8ArrayBlobAdapter.mutate(new Uint8Array());
    }
    const fromContext = context.streamCollector(streamBody);
    return Uint8ArrayBlobAdapter.mutate(await fromContext);
};


/***/ }),

/***/ 1095:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OV: () => (/* binding */ resolveHostHeaderConfig),
/* harmony export */   TC: () => (/* binding */ getHostHeaderPlugin)
/* harmony export */ });
/* unused harmony exports hostHeaderMiddleware, hostHeaderMiddlewareOptions */
/* harmony import */ var _smithy_protocol_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7324);

function resolveHostHeaderConfig(input) {
    return input;
}
const hostHeaderMiddleware = (options) => (next) => async (args) => {
    if (!_smithy_protocol_http__WEBPACK_IMPORTED_MODULE_0__/* .HttpRequest */ .K.isInstance(args.request))
        return next(args);
    const { request } = args;
    const { handlerProtocol = "" } = options.requestHandler.metadata || {};
    if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
        delete request.headers["host"];
        request.headers[":authority"] = request.hostname + (request.port ? ":" + request.port : "");
    }
    else if (!request.headers["host"]) {
        let host = request.hostname;
        if (request.port != null)
            host += `:${request.port}`;
        request.headers["host"] = host;
    }
    return next(args);
};
const hostHeaderMiddlewareOptions = {
    name: "hostHeaderMiddleware",
    step: "build",
    priority: "low",
    tags: ["HOST"],
    override: true,
};
const getHostHeaderPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(hostHeaderMiddleware(options), hostHeaderMiddlewareOptions);
    },
});


/***/ }),

/***/ 1226:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Tj: () => (/* binding */ map),
/* harmony export */   s: () => (/* binding */ take)
/* harmony export */ });
/* unused harmony export convertMap */
function map(arg0, arg1, arg2) {
    let target;
    let filter;
    let instructions;
    if (typeof arg1 === "undefined" && typeof arg2 === "undefined") {
        target = {};
        instructions = arg0;
    }
    else {
        target = arg0;
        if (typeof arg1 === "function") {
            filter = arg1;
            instructions = arg2;
            return mapWithFilter(target, filter, instructions);
        }
        else {
            instructions = arg1;
        }
    }
    for (const key of Object.keys(instructions)) {
        if (!Array.isArray(instructions[key])) {
            target[key] = instructions[key];
            continue;
        }
        applyInstruction(target, null, instructions, key);
    }
    return target;
}
const convertMap = (target) => {
    const output = {};
    for (const [k, v] of Object.entries(target || {})) {
        output[k] = [, v];
    }
    return output;
};
const take = (source, instructions) => {
    const out = {};
    for (const key in instructions) {
        applyInstruction(out, source, instructions, key);
    }
    return out;
};
const mapWithFilter = (target, filter, instructions) => {
    return map(target, Object.entries(instructions).reduce((_instructions, [key, value]) => {
        if (Array.isArray(value)) {
            _instructions[key] = value;
        }
        else {
            if (typeof value === "function") {
                _instructions[key] = [filter, value()];
            }
            else {
                _instructions[key] = [filter, value];
            }
        }
        return _instructions;
    }, {}));
};
const applyInstruction = (target, source, instructions, targetKey) => {
    if (source !== null) {
        let instruction = instructions[targetKey];
        if (typeof instruction === "function") {
            instruction = [, instruction];
        }
        const [filter = nonNullish, valueFn = pass, sourceKey = targetKey] = instruction;
        if ((typeof filter === "function" && filter(source[sourceKey])) || (typeof filter !== "function" && !!filter)) {
            target[targetKey] = valueFn(source[sourceKey]);
        }
        return;
    }
    let [filter, value] = instructions[targetKey];
    if (typeof value === "function") {
        let _value;
        const defaultFilterPassed = filter === undefined && (_value = value()) != null;
        const customFilterPassed = (typeof filter === "function" && !!filter(void 0)) || (typeof filter !== "function" && !!filter);
        if (defaultFilterPassed) {
            target[targetKey] = _value;
        }
        else if (customFilterPassed) {
            target[targetKey] = value();
        }
    }
    else {
        const defaultFilterPassed = filter === undefined && value != null;
        const customFilterPassed = (typeof filter === "function" && !!filter(value)) || (typeof filter !== "function" && !!filter);
        if (defaultFilterPassed || customFilterPassed) {
            target[targetKey] = value;
        }
    }
};
const nonNullish = (_) => _ != null;
const pass = (_) => _;


/***/ }),

/***/ 1395:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E: () => (/* binding */ fromBase64)
/* harmony export */ });
/* harmony import */ var _smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6909);

const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
const fromBase64 = (input) => {
    if ((input.length * 3) % 4 !== 0) {
        throw new TypeError(`Incorrect padding on base64 string.`);
    }
    if (!BASE64_REGEX.exec(input)) {
        throw new TypeError(`Invalid base64 string.`);
    }
    const buffer = (0,_smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__/* .fromString */ .s)(input, "base64");
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
};


/***/ }),

/***/ 1466:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   o: () => (/* binding */ isIpAddress)
/* harmony export */ });
const IP_V4_REGEX = new RegExp(`^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`);
const isIpAddress = (value) => IP_V4_REGEX.test(value) || (value.startsWith("[") && value.endsWith("]"));


/***/ }),

/***/ 1476:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ parseIni)
/* harmony export */ });
/* harmony import */ var _smithy_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5578);
/* harmony import */ var _loadSharedConfigFiles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5546);


const prefixKeyRegex = /^([\w-]+)\s(["'])?([\w-@\+\.%:/]+)\2$/;
const profileNameBlockList = ["__proto__", "profile __proto__"];
const parseIni = (iniData) => {
    const map = {};
    let currentSection;
    let currentSubSection;
    for (const iniLine of iniData.split(/\r?\n/)) {
        const trimmedLine = iniLine.split(/(^|\s)[;#]/)[0].trim();
        const isSection = trimmedLine[0] === "[" && trimmedLine[trimmedLine.length - 1] === "]";
        if (isSection) {
            currentSection = undefined;
            currentSubSection = undefined;
            const sectionName = trimmedLine.substring(1, trimmedLine.length - 1);
            const matches = prefixKeyRegex.exec(sectionName);
            if (matches) {
                const [, prefix, , name] = matches;
                if (Object.values(_smithy_types__WEBPACK_IMPORTED_MODULE_0__/* .IniSectionType */ .I).includes(prefix)) {
                    currentSection = [prefix, name].join(_loadSharedConfigFiles__WEBPACK_IMPORTED_MODULE_1__/* .CONFIG_PREFIX_SEPARATOR */ .Q);
                }
            }
            else {
                currentSection = sectionName;
            }
            if (profileNameBlockList.includes(sectionName)) {
                throw new Error(`Found invalid profile name "${sectionName}"`);
            }
        }
        else if (currentSection) {
            const indexOfEqualsSign = trimmedLine.indexOf("=");
            if (![0, -1].includes(indexOfEqualsSign)) {
                const [name, value] = [
                    trimmedLine.substring(0, indexOfEqualsSign).trim(),
                    trimmedLine.substring(indexOfEqualsSign + 1).trim(),
                ];
                if (value === "") {
                    currentSubSection = name;
                }
                else {
                    if (currentSubSection && iniLine.trimStart() === iniLine) {
                        currentSubSection = undefined;
                    }
                    map[currentSection] = map[currentSection] || {};
                    const key = currentSubSection ? [currentSubSection, name].join(_loadSharedConfigFiles__WEBPACK_IMPORTED_MODULE_1__/* .CONFIG_PREFIX_SEPARATOR */ .Q) : name;
                    map[currentSection][key] = value;
                }
            }
        }
    }
    return map;
};


/***/ }),

/***/ 1478:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pi: () => (/* binding */ ENV_SECRET),
/* harmony export */   sF: () => (/* binding */ fromEnv),
/* harmony export */   yG: () => (/* binding */ ENV_KEY)
/* harmony export */ });
/* unused harmony exports ENV_SESSION, ENV_EXPIRATION, ENV_CREDENTIAL_SCOPE, ENV_ACCOUNT_ID */
/* harmony import */ var _aws_sdk_core_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(244);
/* harmony import */ var _smithy_property_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3052);


const ENV_KEY = "AWS_ACCESS_KEY_ID";
const ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
const ENV_SESSION = "AWS_SESSION_TOKEN";
const ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
const ENV_CREDENTIAL_SCOPE = "AWS_CREDENTIAL_SCOPE";
const ENV_ACCOUNT_ID = "AWS_ACCOUNT_ID";
const fromEnv = (init) => async () => {
    init?.logger?.debug("@aws-sdk/credential-provider-env - fromEnv");
    const accessKeyId = process.env[ENV_KEY];
    const secretAccessKey = process.env[ENV_SECRET];
    const sessionToken = process.env[ENV_SESSION];
    const expiry = process.env[ENV_EXPIRATION];
    const credentialScope = process.env[ENV_CREDENTIAL_SCOPE];
    const accountId = process.env[ENV_ACCOUNT_ID];
    if (accessKeyId && secretAccessKey) {
        const credentials = {
            accessKeyId,
            secretAccessKey,
            ...(sessionToken && { sessionToken }),
            ...(expiry && { expiration: new Date(expiry) }),
            ...(credentialScope && { credentialScope }),
            ...(accountId && { accountId }),
        };
        (0,_aws_sdk_core_client__WEBPACK_IMPORTED_MODULE_0__/* .setCredentialFeature */ .g)(credentials, "CREDENTIALS_ENV_VARS", "g");
        return credentials;
    }
    throw new _smithy_property_provider__WEBPACK_IMPORTED_MODULE_1__/* .CredentialsProviderError */ .C("Unable to find environment variable credentials.", { logger: init?.logger });
};


/***/ }),

/***/ 1620:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  I: () => (/* binding */ resolveDefaultsModeConfig)
});

// EXTERNAL MODULE: ./node_modules/@smithy/config-resolver/dist-es/regionConfig/config.js
var config = __webpack_require__(4836);
// EXTERNAL MODULE: ./node_modules/@smithy/node-config-provider/dist-es/configLoader.js + 5 modules
var configLoader = __webpack_require__(4013);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/memoize.js
var memoize = __webpack_require__(3783);
;// ./node_modules/@smithy/util-defaults-mode-node/dist-es/constants.js
const AWS_EXECUTION_ENV = "AWS_EXECUTION_ENV";
const AWS_REGION_ENV = "AWS_REGION";
const AWS_DEFAULT_REGION_ENV = "AWS_DEFAULT_REGION";
const ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
const DEFAULTS_MODE_OPTIONS = ["in-region", "cross-region", "mobile", "standard", "legacy"];
const IMDS_REGION_PATH = "/latest/meta-data/placement/region";

;// ./node_modules/@smithy/util-defaults-mode-node/dist-es/defaultsModeConfig.js
const AWS_DEFAULTS_MODE_ENV = "AWS_DEFAULTS_MODE";
const AWS_DEFAULTS_MODE_CONFIG = "defaults_mode";
const NODE_DEFAULTS_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => {
        return env[AWS_DEFAULTS_MODE_ENV];
    },
    configFileSelector: (profile) => {
        return profile[AWS_DEFAULTS_MODE_CONFIG];
    },
    default: "legacy",
};

;// ./node_modules/@smithy/util-defaults-mode-node/dist-es/resolveDefaultsModeConfig.js





const resolveDefaultsModeConfig = ({ region = (0,configLoader/* loadConfig */.Z)(config/* NODE_REGION_CONFIG_OPTIONS */.GG), defaultsMode = (0,configLoader/* loadConfig */.Z)(NODE_DEFAULTS_MODE_CONFIG_OPTIONS), } = {}) => (0,memoize/* memoize */.B)(async () => {
    const mode = typeof defaultsMode === "function" ? await defaultsMode() : defaultsMode;
    switch (mode?.toLowerCase()) {
        case "auto":
            return resolveNodeDefaultsModeAuto(region);
        case "in-region":
        case "cross-region":
        case "mobile":
        case "standard":
        case "legacy":
            return Promise.resolve(mode?.toLocaleLowerCase());
        case undefined:
            return Promise.resolve("legacy");
        default:
            throw new Error(`Invalid parameter for "defaultsMode", expect ${DEFAULTS_MODE_OPTIONS.join(", ")}, got ${mode}`);
    }
});
const resolveNodeDefaultsModeAuto = async (clientRegion) => {
    if (clientRegion) {
        const resolvedRegion = typeof clientRegion === "function" ? await clientRegion() : clientRegion;
        const inferredRegion = await inferPhysicalRegion();
        if (!inferredRegion) {
            return "standard";
        }
        if (resolvedRegion === inferredRegion) {
            return "in-region";
        }
        else {
            return "cross-region";
        }
    }
    return "standard";
};
const inferPhysicalRegion = async () => {
    if (process.env[AWS_EXECUTION_ENV] && (process.env[AWS_REGION_ENV] || process.env[AWS_DEFAULT_REGION_ENV])) {
        return process.env[AWS_REGION_ENV] ?? process.env[AWS_DEFAULT_REGION_ENV];
    }
    if (!process.env[ENV_IMDS_DISABLED]) {
        try {
            const { getInstanceMetadataEndpoint, httpRequest } = await __webpack_require__.e(/* import() */ 897).then(__webpack_require__.bind(__webpack_require__, 7897));
            const endpoint = await getInstanceMetadataEndpoint();
            return (await httpRequest({ ...endpoint, path: IMDS_REGION_PATH })).toString();
        }
        catch (e) {
        }
    }
};


/***/ }),

/***/ 1671:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   o: () => (/* binding */ constructStack)
/* harmony export */ });
const getAllAliases = (name, aliases) => {
    const _aliases = [];
    if (name) {
        _aliases.push(name);
    }
    if (aliases) {
        for (const alias of aliases) {
            _aliases.push(alias);
        }
    }
    return _aliases;
};
const getMiddlewareNameWithAliases = (name, aliases) => {
    return `${name || "anonymous"}${aliases && aliases.length > 0 ? ` (a.k.a. ${aliases.join(",")})` : ""}`;
};
const constructStack = () => {
    let absoluteEntries = [];
    let relativeEntries = [];
    let identifyOnResolve = false;
    const entriesNameSet = new Set();
    const sort = (entries) => entries.sort((a, b) => stepWeights[b.step] - stepWeights[a.step] ||
        priorityWeights[b.priority || "normal"] - priorityWeights[a.priority || "normal"]);
    const removeByName = (toRemove) => {
        let isRemoved = false;
        const filterCb = (entry) => {
            const aliases = getAllAliases(entry.name, entry.aliases);
            if (aliases.includes(toRemove)) {
                isRemoved = true;
                for (const alias of aliases) {
                    entriesNameSet.delete(alias);
                }
                return false;
            }
            return true;
        };
        absoluteEntries = absoluteEntries.filter(filterCb);
        relativeEntries = relativeEntries.filter(filterCb);
        return isRemoved;
    };
    const removeByReference = (toRemove) => {
        let isRemoved = false;
        const filterCb = (entry) => {
            if (entry.middleware === toRemove) {
                isRemoved = true;
                for (const alias of getAllAliases(entry.name, entry.aliases)) {
                    entriesNameSet.delete(alias);
                }
                return false;
            }
            return true;
        };
        absoluteEntries = absoluteEntries.filter(filterCb);
        relativeEntries = relativeEntries.filter(filterCb);
        return isRemoved;
    };
    const cloneTo = (toStack) => {
        absoluteEntries.forEach((entry) => {
            toStack.add(entry.middleware, { ...entry });
        });
        relativeEntries.forEach((entry) => {
            toStack.addRelativeTo(entry.middleware, { ...entry });
        });
        toStack.identifyOnResolve?.(stack.identifyOnResolve());
        return toStack;
    };
    const expandRelativeMiddlewareList = (from) => {
        const expandedMiddlewareList = [];
        from.before.forEach((entry) => {
            if (entry.before.length === 0 && entry.after.length === 0) {
                expandedMiddlewareList.push(entry);
            }
            else {
                expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
            }
        });
        expandedMiddlewareList.push(from);
        from.after.reverse().forEach((entry) => {
            if (entry.before.length === 0 && entry.after.length === 0) {
                expandedMiddlewareList.push(entry);
            }
            else {
                expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
            }
        });
        return expandedMiddlewareList;
    };
    const getMiddlewareList = (debug = false) => {
        const normalizedAbsoluteEntries = [];
        const normalizedRelativeEntries = [];
        const normalizedEntriesNameMap = {};
        absoluteEntries.forEach((entry) => {
            const normalizedEntry = {
                ...entry,
                before: [],
                after: [],
            };
            for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
                normalizedEntriesNameMap[alias] = normalizedEntry;
            }
            normalizedAbsoluteEntries.push(normalizedEntry);
        });
        relativeEntries.forEach((entry) => {
            const normalizedEntry = {
                ...entry,
                before: [],
                after: [],
            };
            for (const alias of getAllAliases(normalizedEntry.name, normalizedEntry.aliases)) {
                normalizedEntriesNameMap[alias] = normalizedEntry;
            }
            normalizedRelativeEntries.push(normalizedEntry);
        });
        normalizedRelativeEntries.forEach((entry) => {
            if (entry.toMiddleware) {
                const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
                if (toMiddleware === undefined) {
                    if (debug) {
                        return;
                    }
                    throw new Error(`${entry.toMiddleware} is not found when adding ` +
                        `${getMiddlewareNameWithAliases(entry.name, entry.aliases)} ` +
                        `middleware ${entry.relation} ${entry.toMiddleware}`);
                }
                if (entry.relation === "after") {
                    toMiddleware.after.push(entry);
                }
                if (entry.relation === "before") {
                    toMiddleware.before.push(entry);
                }
            }
        });
        const mainChain = sort(normalizedAbsoluteEntries)
            .map(expandRelativeMiddlewareList)
            .reduce((wholeList, expandedMiddlewareList) => {
            wholeList.push(...expandedMiddlewareList);
            return wholeList;
        }, []);
        return mainChain;
    };
    const stack = {
        add: (middleware, options = {}) => {
            const { name, override, aliases: _aliases } = options;
            const entry = {
                step: "initialize",
                priority: "normal",
                middleware,
                ...options,
            };
            const aliases = getAllAliases(name, _aliases);
            if (aliases.length > 0) {
                if (aliases.some((alias) => entriesNameSet.has(alias))) {
                    if (!override)
                        throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
                    for (const alias of aliases) {
                        const toOverrideIndex = absoluteEntries.findIndex((entry) => entry.name === alias || entry.aliases?.some((a) => a === alias));
                        if (toOverrideIndex === -1) {
                            continue;
                        }
                        const toOverride = absoluteEntries[toOverrideIndex];
                        if (toOverride.step !== entry.step || entry.priority !== toOverride.priority) {
                            throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware with ` +
                                `${toOverride.priority} priority in ${toOverride.step} step cannot ` +
                                `be overridden by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware with ` +
                                `${entry.priority} priority in ${entry.step} step.`);
                        }
                        absoluteEntries.splice(toOverrideIndex, 1);
                    }
                }
                for (const alias of aliases) {
                    entriesNameSet.add(alias);
                }
            }
            absoluteEntries.push(entry);
        },
        addRelativeTo: (middleware, options) => {
            const { name, override, aliases: _aliases } = options;
            const entry = {
                middleware,
                ...options,
            };
            const aliases = getAllAliases(name, _aliases);
            if (aliases.length > 0) {
                if (aliases.some((alias) => entriesNameSet.has(alias))) {
                    if (!override)
                        throw new Error(`Duplicate middleware name '${getMiddlewareNameWithAliases(name, _aliases)}'`);
                    for (const alias of aliases) {
                        const toOverrideIndex = relativeEntries.findIndex((entry) => entry.name === alias || entry.aliases?.some((a) => a === alias));
                        if (toOverrideIndex === -1) {
                            continue;
                        }
                        const toOverride = relativeEntries[toOverrideIndex];
                        if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
                            throw new Error(`"${getMiddlewareNameWithAliases(toOverride.name, toOverride.aliases)}" middleware ` +
                                `${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden ` +
                                `by "${getMiddlewareNameWithAliases(name, _aliases)}" middleware ${entry.relation} ` +
                                `"${entry.toMiddleware}" middleware.`);
                        }
                        relativeEntries.splice(toOverrideIndex, 1);
                    }
                }
                for (const alias of aliases) {
                    entriesNameSet.add(alias);
                }
            }
            relativeEntries.push(entry);
        },
        clone: () => cloneTo(constructStack()),
        use: (plugin) => {
            plugin.applyToStack(stack);
        },
        remove: (toRemove) => {
            if (typeof toRemove === "string")
                return removeByName(toRemove);
            else
                return removeByReference(toRemove);
        },
        removeByTag: (toRemove) => {
            let isRemoved = false;
            const filterCb = (entry) => {
                const { tags, name, aliases: _aliases } = entry;
                if (tags && tags.includes(toRemove)) {
                    const aliases = getAllAliases(name, _aliases);
                    for (const alias of aliases) {
                        entriesNameSet.delete(alias);
                    }
                    isRemoved = true;
                    return false;
                }
                return true;
            };
            absoluteEntries = absoluteEntries.filter(filterCb);
            relativeEntries = relativeEntries.filter(filterCb);
            return isRemoved;
        },
        concat: (from) => {
            const cloned = cloneTo(constructStack());
            cloned.use(from);
            cloned.identifyOnResolve(identifyOnResolve || cloned.identifyOnResolve() || (from.identifyOnResolve?.() ?? false));
            return cloned;
        },
        applyToStack: cloneTo,
        identify: () => {
            return getMiddlewareList(true).map((mw) => {
                const step = mw.step ??
                    mw.relation +
                        " " +
                        mw.toMiddleware;
                return getMiddlewareNameWithAliases(mw.name, mw.aliases) + " - " + step;
            });
        },
        identifyOnResolve(toggle) {
            if (typeof toggle === "boolean")
                identifyOnResolve = toggle;
            return identifyOnResolve;
        },
        resolve: (handler, context) => {
            for (const middleware of getMiddlewareList()
                .map((entry) => entry.middleware)
                .reverse()) {
                handler = middleware(handler, context);
            }
            if (identifyOnResolve) {
                console.log(stack.identify());
            }
            return handler;
        },
    };
    return stack;
};
const stepWeights = {
    initialize: 5,
    serialize: 4,
    build: 3,
    finalizeRequest: 2,
    deserialize: 1,
};
const priorityWeights = {
    high: 3,
    normal: 2,
    low: 1,
};


/***/ }),

/***/ 1698:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  TM: () => (/* binding */ getSerdePlugin),
  Ou: () => (/* binding */ serializerMiddlewareOption)
});

// UNUSED EXPORTS: deserializerMiddlewareOption

// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpResponse.js
var httpResponse = __webpack_require__(4094);
;// ./node_modules/@smithy/middleware-serde/dist-es/deserializerMiddleware.js

const deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
    const { response } = await next(args);
    try {
        const parsed = await deserializer(response, options);
        return {
            response,
            output: parsed,
        };
    }
    catch (error) {
        Object.defineProperty(error, "$response", {
            value: response,
        });
        if (!("$metadata" in error)) {
            const hint = `Deserialization error: to see the raw response, inspect the hidden field {error}.$response on this object.`;
            try {
                error.message += "\n  " + hint;
            }
            catch (e) {
                if (!context.logger || context.logger?.constructor?.name === "NoOpLogger") {
                    console.warn(hint);
                }
                else {
                    context.logger?.warn?.(hint);
                }
            }
            if (typeof error.$responseBodyText !== "undefined") {
                if (error.$response) {
                    error.$response.body = error.$responseBodyText;
                }
            }
            try {
                if (httpResponse/* HttpResponse */.c.isInstance(response)) {
                    const { headers = {} } = response;
                    const headerEntries = Object.entries(headers);
                    error.$metadata = {
                        httpStatusCode: response.statusCode,
                        requestId: findHeader(/^x-[\w-]+-request-?id$/, headerEntries),
                        extendedRequestId: findHeader(/^x-[\w-]+-id-2$/, headerEntries),
                        cfId: findHeader(/^x-[\w-]+-cf-id$/, headerEntries),
                    };
                }
            }
            catch (e) {
            }
        }
        throw error;
    }
};
const findHeader = (pattern, headers) => {
    return (headers.find(([k]) => {
        return k.match(pattern);
    }) || [void 0, void 1])[1];
};

;// ./node_modules/@smithy/middleware-serde/dist-es/serializerMiddleware.js
const serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
    const endpointConfig = options;
    const endpoint = context.endpointV2?.url && endpointConfig.urlParser
        ? async () => endpointConfig.urlParser(context.endpointV2.url)
        : endpointConfig.endpoint;
    if (!endpoint) {
        throw new Error("No valid endpoint provider available.");
    }
    const request = await serializer(args.input, { ...options, endpoint });
    return next({
        ...args,
        request,
    });
};

;// ./node_modules/@smithy/middleware-serde/dist-es/serdePlugin.js


const deserializerMiddlewareOption = {
    name: "deserializerMiddleware",
    step: "deserialize",
    tags: ["DESERIALIZER"],
    override: true,
};
const serializerMiddlewareOption = {
    name: "serializerMiddleware",
    step: "serialize",
    tags: ["SERIALIZER"],
    override: true,
};
function getSerdePlugin(config, serializer, deserializer) {
    return {
        applyToStack: (commandStack) => {
            commandStack.add(deserializerMiddleware(config, deserializer), deserializerMiddlewareOption);
            commandStack.add(serializerMiddleware(config, serializer), serializerMiddlewareOption);
        },
    };
}


/***/ }),

/***/ 1701:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   V: () => (/* binding */ Hash)
/* harmony export */ });
/* harmony import */ var _smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6909);
/* harmony import */ var _smithy_util_utf8__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4424);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(181);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(buffer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6982);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_3__);




class Hash {
    constructor(algorithmIdentifier, secret) {
        this.algorithmIdentifier = algorithmIdentifier;
        this.secret = secret;
        this.reset();
    }
    update(toHash, encoding) {
        this.hash.update((0,_smithy_util_utf8__WEBPACK_IMPORTED_MODULE_1__/* .toUint8Array */ .F)(castSourceData(toHash, encoding)));
    }
    digest() {
        return Promise.resolve(this.hash.digest());
    }
    reset() {
        this.hash = this.secret
            ? (0,crypto__WEBPACK_IMPORTED_MODULE_3__.createHmac)(this.algorithmIdentifier, castSourceData(this.secret))
            : (0,crypto__WEBPACK_IMPORTED_MODULE_3__.createHash)(this.algorithmIdentifier);
    }
}
function castSourceData(toCast, encoding) {
    if (buffer__WEBPACK_IMPORTED_MODULE_2__.Buffer.isBuffer(toCast)) {
        return toCast;
    }
    if (typeof toCast === "string") {
        return (0,_smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__/* .fromString */ .s)(toCast, encoding);
    }
    if (ArrayBuffer.isView(toCast)) {
        return (0,_smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__/* .fromArrayBuffer */ .Q)(toCast.buffer, toCast.byteOffset, toCast.byteLength);
    }
    return (0,_smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__/* .fromArrayBuffer */ .Q)(toCast);
}


/***/ }),

/***/ 1724:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
exports.A = void 0;
const async_hooks_1 = __webpack_require__(290);
// AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA provides an escape hatch since we're modifying the global object which may not be expected to a customer's handler.
const noGlobalAwsLambda = process.env["AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA"] === "1" ||
    process.env["AWS_LAMBDA_NODEJS_NO_GLOBAL_AWSLAMBDA"] === "true";
if (!noGlobalAwsLambda) {
    globalThis.awslambda = globalThis.awslambda || {};
}
const PROTECTED_KEYS = {
    REQUEST_ID: Symbol("_AWS_LAMBDA_REQUEST_ID"),
    X_RAY_TRACE_ID: Symbol("_AWS_LAMBDA_X_RAY_TRACE_ID"),
};
/**
 * InvokeStore implementation class
 */
class InvokeStoreImpl {
    static storage = new async_hooks_1.AsyncLocalStorage();
    // Protected keys for Lambda context fields
    static PROTECTED_KEYS = PROTECTED_KEYS;
    /**
     * Initialize and run code within an invoke context
     */
    static run(context, fn) {
        return this.storage.run({ ...context }, fn);
    }
    /**
     * Get the complete current context
     */
    static getContext() {
        return this.storage.getStore();
    }
    /**
     * Get a specific value from the context by key
     */
    static get(key) {
        const context = this.storage.getStore();
        return context?.[key];
    }
    /**
     * Set a custom value in the current context
     * Protected Lambda context fields cannot be overwritten
     */
    static set(key, value) {
        if (this.isProtectedKey(key)) {
            throw new Error(`Cannot modify protected Lambda context field`);
        }
        const context = this.storage.getStore();
        if (context) {
            context[key] = value;
        }
    }
    /**
     * Get the current request ID
     */
    static getRequestId() {
        return this.get(this.PROTECTED_KEYS.REQUEST_ID) ?? "-";
    }
    /**
     * Get the current X-ray trace ID
     */
    static getXRayTraceId() {
        return this.get(this.PROTECTED_KEYS.X_RAY_TRACE_ID);
    }
    /**
     * Check if we're currently within an invoke context
     */
    static hasContext() {
        return this.storage.getStore() !== undefined;
    }
    /**
     * Check if a key is protected (readonly Lambda context field)
     */
    static isProtectedKey(key) {
        return (key === this.PROTECTED_KEYS.REQUEST_ID ||
            key === this.PROTECTED_KEYS.X_RAY_TRACE_ID);
    }
}
let instance;
if (!noGlobalAwsLambda && globalThis.awslambda?.InvokeStore) {
    instance = globalThis.awslambda.InvokeStore;
}
else {
    instance = InvokeStoreImpl;
    if (!noGlobalAwsLambda && globalThis.awslambda) {
        globalThis.awslambda.InvokeStore = instance;
    }
}
exports.A = instance;


/***/ }),

/***/ 1919:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CG: () => (/* binding */ parseJsonErrorBody),
/* harmony export */   Y2: () => (/* binding */ parseJsonBody),
/* harmony export */   cJ: () => (/* binding */ loadRestJsonErrorCode)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8218);

const parseJsonBody = (streamBody, context) => (0,_common__WEBPACK_IMPORTED_MODULE_0__/* .collectBodyString */ .w)(streamBody, context).then((encoded) => {
    if (encoded.length) {
        try {
            return JSON.parse(encoded);
        }
        catch (e) {
            if (e?.name === "SyntaxError") {
                Object.defineProperty(e, "$responseBodyText", {
                    value: encoded,
                });
            }
            throw e;
        }
    }
    return {};
});
const parseJsonErrorBody = async (errorBody, context) => {
    const value = await parseJsonBody(errorBody, context);
    value.message = value.message ?? value.Message;
    return value;
};
const loadRestJsonErrorCode = (output, data) => {
    const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
    const sanitizeErrorCode = (rawValue) => {
        let cleanValue = rawValue;
        if (typeof cleanValue === "number") {
            cleanValue = cleanValue.toString();
        }
        if (cleanValue.indexOf(",") >= 0) {
            cleanValue = cleanValue.split(",")[0];
        }
        if (cleanValue.indexOf(":") >= 0) {
            cleanValue = cleanValue.split(":")[0];
        }
        if (cleanValue.indexOf("#") >= 0) {
            cleanValue = cleanValue.split("#")[1];
        }
        return cleanValue;
    };
    const headerKey = findKey(output.headers, "x-amzn-errortype");
    if (headerKey !== undefined) {
        return sanitizeErrorCode(output.headers[headerKey]);
    }
    if (data && typeof data === "object") {
        const codeKey = findKey(data, "code");
        if (codeKey && data[codeKey] !== undefined) {
            return sanitizeErrorCode(data[codeKey]);
        }
        if (data["__type"] !== undefined) {
            return sanitizeErrorCode(data["__type"]);
        }
    }
};


/***/ }),

/***/ 1943:
/***/ ((module) => {

module.exports = require("fs/promises");

/***/ }),

/***/ 2184:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e$: () => (/* binding */ NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS)
/* harmony export */ });
/* unused harmony exports ENV_USE_DUALSTACK_ENDPOINT, CONFIG_USE_DUALSTACK_ENDPOINT, DEFAULT_USE_DUALSTACK_ENDPOINT */
/* harmony import */ var _smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5938);
/* harmony import */ var _smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3466);

const ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
const CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
const DEFAULT_USE_DUALSTACK_ENDPOINT = false;
const NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => (0,_smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_0__/* .booleanSelector */ .Q)(env, ENV_USE_DUALSTACK_ENDPOINT, _smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_1__/* .SelectorType */ .c.ENV),
    configFileSelector: (profile) => (0,_smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_0__/* .booleanSelector */ .Q)(profile, CONFIG_USE_DUALSTACK_ENDPOINT, _smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_1__/* .SelectorType */ .c.CONFIG),
    default: false,
};


/***/ }),

/***/ 2203:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 2291:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   n: () => (/* binding */ calculateBodyLength)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9896);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);

const calculateBodyLength = (body) => {
    if (!body) {
        return 0;
    }
    if (typeof body === "string") {
        return Buffer.byteLength(body);
    }
    else if (typeof body.byteLength === "number") {
        return body.byteLength;
    }
    else if (typeof body.size === "number") {
        return body.size;
    }
    else if (typeof body.start === "number" && typeof body.end === "number") {
        return body.end + 1 - body.start;
    }
    else if (typeof body.path === "string" || Buffer.isBuffer(body.path)) {
        return (0,fs__WEBPACK_IMPORTED_MODULE_0__.lstatSync)(body.path).size;
    }
    else if (typeof body.fd === "number") {
        return (0,fs__WEBPACK_IMPORTED_MODULE_0__.fstatSync)(body.fd).size;
    }
    throw new Error(`Body Length computation failed for ${body}`);
};


/***/ }),

/***/ 2339:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ emitWarningIfUnsupportedVersion)
/* harmony export */ });
let warningEmitted = false;
const emitWarningIfUnsupportedVersion = (version) => {
    if (version && !warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 16) {
        warningEmitted = true;
    }
};


/***/ }),

/***/ 2404:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  w: () => (/* binding */ getHttpAuthSchemeEndpointRuleSetPlugin)
});

// UNUSED EXPORTS: httpAuthSchemeEndpointRuleSetMiddlewareOptions

// EXTERNAL MODULE: ./node_modules/@smithy/util-middleware/dist-es/getSmithyContext.js
var getSmithyContext = __webpack_require__(6116);
;// ./node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/resolveAuthOptions.js
const resolveAuthOptions = (candidateAuthOptions, authSchemePreference) => {
    if (!authSchemePreference || authSchemePreference.length === 0) {
        return candidateAuthOptions;
    }
    const preferredAuthOptions = [];
    for (const preferredSchemeName of authSchemePreference) {
        for (const candidateAuthOption of candidateAuthOptions) {
            const candidateAuthSchemeName = candidateAuthOption.schemeId.split("#")[1];
            if (candidateAuthSchemeName === preferredSchemeName) {
                preferredAuthOptions.push(candidateAuthOption);
            }
        }
    }
    for (const candidateAuthOption of candidateAuthOptions) {
        if (!preferredAuthOptions.find(({ schemeId }) => schemeId === candidateAuthOption.schemeId)) {
            preferredAuthOptions.push(candidateAuthOption);
        }
    }
    return preferredAuthOptions;
};

;// ./node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/httpAuthSchemeMiddleware.js


function convertHttpAuthSchemesToMap(httpAuthSchemes) {
    const map = new Map();
    for (const scheme of httpAuthSchemes) {
        map.set(scheme.schemeId, scheme);
    }
    return map;
}
const httpAuthSchemeMiddleware = (config, mwOptions) => (next, context) => async (args) => {
    const options = config.httpAuthSchemeProvider(await mwOptions.httpAuthSchemeParametersProvider(config, context, args.input));
    const authSchemePreference = config.authSchemePreference ? await config.authSchemePreference() : [];
    const resolvedOptions = resolveAuthOptions(options, authSchemePreference);
    const authSchemes = convertHttpAuthSchemesToMap(config.httpAuthSchemes);
    const smithyContext = (0,getSmithyContext/* getSmithyContext */.u)(context);
    const failureReasons = [];
    for (const option of resolvedOptions) {
        const scheme = authSchemes.get(option.schemeId);
        if (!scheme) {
            failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` was not enabled for this service.`);
            continue;
        }
        const identityProvider = scheme.identityProvider(await mwOptions.identityProviderConfigProvider(config));
        if (!identityProvider) {
            failureReasons.push(`HttpAuthScheme \`${option.schemeId}\` did not have an IdentityProvider configured.`);
            continue;
        }
        const { identityProperties = {}, signingProperties = {} } = option.propertiesExtractor?.(config, context) || {};
        option.identityProperties = Object.assign(option.identityProperties || {}, identityProperties);
        option.signingProperties = Object.assign(option.signingProperties || {}, signingProperties);
        smithyContext.selectedHttpAuthScheme = {
            httpAuthOption: option,
            identity: await identityProvider(option.identityProperties),
            signer: scheme.signer,
        };
        break;
    }
    if (!smithyContext.selectedHttpAuthScheme) {
        throw new Error(failureReasons.join("\n"));
    }
    return next(args);
};

;// ./node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemeEndpointRuleSetPlugin.js

const httpAuthSchemeEndpointRuleSetMiddlewareOptions = {
    step: "serialize",
    tags: ["HTTP_AUTH_SCHEME"],
    name: "httpAuthSchemeMiddleware",
    override: true,
    relation: "before",
    toMiddleware: "endpointV2Middleware",
};
const getHttpAuthSchemeEndpointRuleSetPlugin = (config, { httpAuthSchemeParametersProvider, identityProviderConfigProvider, }) => ({
    applyToStack: (clientStack) => {
        clientStack.addRelativeTo(httpAuthSchemeMiddleware(config, {
            httpAuthSchemeParametersProvider,
            identityProviderConfigProvider,
        }), httpAuthSchemeEndpointRuleSetMiddlewareOptions);
    },
});


/***/ }),

/***/ 2432:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   g: () => (/* binding */ getConfigFilepath)
/* harmony export */ });
/* unused harmony export ENV_CONFIG_PATH */
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4547);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _getHomeDir__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7029);


const ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
const getConfigFilepath = () => process.env[ENV_CONFIG_PATH] || (0,path__WEBPACK_IMPORTED_MODULE_0__.join)((0,_getHomeDir__WEBPACK_IMPORTED_MODULE_1__/* .getHomeDir */ .R)(), ".aws", "config");


/***/ }),

/***/ 2531:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   o: () => (/* binding */ escapeUri)
/* harmony export */ });
const escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
const hexEncode = (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`;


/***/ }),

/***/ 2641:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  D: () => (/* binding */ parseUrl)
});

;// ./node_modules/@smithy/querystring-parser/dist-es/index.js
function parseQueryString(querystring) {
    const query = {};
    querystring = querystring.replace(/^\?/, "");
    if (querystring) {
        for (const pair of querystring.split("&")) {
            let [key, value = null] = pair.split("=");
            key = decodeURIComponent(key);
            if (value) {
                value = decodeURIComponent(value);
            }
            if (!(key in query)) {
                query[key] = value;
            }
            else if (Array.isArray(query[key])) {
                query[key].push(value);
            }
            else {
                query[key] = [query[key], value];
            }
        }
    }
    return query;
}

;// ./node_modules/@smithy/url-parser/dist-es/index.js

const parseUrl = (url) => {
    if (typeof url === "string") {
        return parseUrl(new URL(url));
    }
    const { hostname, pathname, port, protocol, search } = url;
    let query;
    if (search) {
        query = parseQueryString(search);
    }
    return {
        hostname,
        port: port ? parseInt(port) : undefined,
        protocol,
        path: pathname,
        query,
    };
};


/***/ }),

/***/ 2741:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ emitWarningIfUnsupportedVersion)
/* harmony export */ });
/* unused harmony export state */
const state = {
    warningEmitted: false,
};
const emitWarningIfUnsupportedVersion = (version) => {
    if (version && !state.warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 18) {
        state.warningEmitted = true;
        process.emitWarning(`NodeDeprecationWarning: The AWS SDK for JavaScript (v3) will
no longer support Node.js 16.x on January 6, 2025.

To continue receiving updates to AWS services, bug fixes, and security
updates please upgrade to a supported Node.js LTS version.

More information can be found at: https://a.co/74kJMmI`);
    }
};


/***/ }),

/***/ 2795:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ resolveEndpointConfig)
/* harmony export */ });
/* harmony import */ var _smithy_util_middleware__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8947);
/* harmony import */ var _adaptors_getEndpointFromConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8829);
/* harmony import */ var _adaptors_toEndpointV1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8462);



const resolveEndpointConfig = (input) => {
    const tls = input.tls ?? true;
    const { endpoint, useDualstackEndpoint, useFipsEndpoint } = input;
    const customEndpointProvider = endpoint != null ? async () => (0,_adaptors_toEndpointV1__WEBPACK_IMPORTED_MODULE_2__/* .toEndpointV1 */ .a)(await (0,_smithy_util_middleware__WEBPACK_IMPORTED_MODULE_0__/* .normalizeProvider */ .t)(endpoint)()) : undefined;
    const isCustomEndpoint = !!endpoint;
    const resolvedConfig = Object.assign(input, {
        endpoint: customEndpointProvider,
        tls,
        isCustomEndpoint,
        useDualstackEndpoint: (0,_smithy_util_middleware__WEBPACK_IMPORTED_MODULE_0__/* .normalizeProvider */ .t)(useDualstackEndpoint ?? false),
        useFipsEndpoint: (0,_smithy_util_middleware__WEBPACK_IMPORTED_MODULE_0__/* .normalizeProvider */ .t)(useFipsEndpoint ?? false),
    });
    let configuredEndpointPromise = undefined;
    resolvedConfig.serviceConfiguredEndpoint = async () => {
        if (input.serviceId && !configuredEndpointPromise) {
            configuredEndpointPromise = (0,_adaptors_getEndpointFromConfig__WEBPACK_IMPORTED_MODULE_1__/* .getEndpointFromConfig */ .k)(input.serviceId);
        }
        return configuredEndpointPromise;
    };
    return resolvedConfig;
};


/***/ }),

/***/ 2809:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ SENSITIVE_STRING)
/* harmony export */ });
const SENSITIVE_STRING = "***SensitiveInformation***";


/***/ }),

/***/ 2864:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  w: () => (/* binding */ DEFAULT_REQUEST_TIMEOUT),
  $: () => (/* binding */ NodeHttpHandler)
});

// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpResponse.js
var dist_es_httpResponse = __webpack_require__(4094);
// EXTERNAL MODULE: ./node_modules/@smithy/util-uri-escape/dist-es/escape-uri.js
var escape_uri = __webpack_require__(2531);
;// ./node_modules/@smithy/querystring-builder/dist-es/index.js

function buildQueryString(query) {
    const parts = [];
    for (let key of Object.keys(query).sort()) {
        const value = query[key];
        key = (0,escape_uri/* escapeUri */.o)(key);
        if (Array.isArray(value)) {
            for (let i = 0, iLen = value.length; i < iLen; i++) {
                parts.push(`${key}=${(0,escape_uri/* escapeUri */.o)(value[i])}`);
            }
        }
        else {
            let qsEntry = key;
            if (value || typeof value === "string") {
                qsEntry += `=${(0,escape_uri/* escapeUri */.o)(value)}`;
            }
            parts.push(qsEntry);
        }
    }
    return parts.join("&");
}

// EXTERNAL MODULE: external "http"
var external_http_ = __webpack_require__(8611);
;// external "https"
const external_https_namespaceObject = require("https");
;// ./node_modules/@smithy/node-http-handler/dist-es/constants.js
const NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];

;// ./node_modules/@smithy/node-http-handler/dist-es/get-transformed-headers.js
const getTransformedHeaders = (headers) => {
    const transformedHeaders = {};
    for (const name of Object.keys(headers)) {
        const headerValues = headers[name];
        transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
    }
    return transformedHeaders;
};


;// ./node_modules/@smithy/node-http-handler/dist-es/timing.js
const timing = {
    setTimeout: (cb, ms) => setTimeout(cb, ms),
    clearTimeout: (timeoutId) => clearTimeout(timeoutId),
};

;// ./node_modules/@smithy/node-http-handler/dist-es/set-connection-timeout.js

const DEFER_EVENT_LISTENER_TIME = 1000;
const setConnectionTimeout = (request, reject, timeoutInMs = 0) => {
    if (!timeoutInMs) {
        return -1;
    }
    const registerTimeout = (offset) => {
        const timeoutId = timing.setTimeout(() => {
            request.destroy();
            reject(Object.assign(new Error(`Socket timed out without establishing a connection within ${timeoutInMs} ms`), {
                name: "TimeoutError",
            }));
        }, timeoutInMs - offset);
        const doWithSocket = (socket) => {
            if (socket?.connecting) {
                socket.on("connect", () => {
                    timing.clearTimeout(timeoutId);
                });
            }
            else {
                timing.clearTimeout(timeoutId);
            }
        };
        if (request.socket) {
            doWithSocket(request.socket);
        }
        else {
            request.on("socket", doWithSocket);
        }
    };
    if (timeoutInMs < 2000) {
        registerTimeout(0);
        return 0;
    }
    return timing.setTimeout(registerTimeout.bind(null, DEFER_EVENT_LISTENER_TIME), DEFER_EVENT_LISTENER_TIME);
};

;// ./node_modules/@smithy/node-http-handler/dist-es/set-socket-keep-alive.js

const set_socket_keep_alive_DEFER_EVENT_LISTENER_TIME = 3000;
const setSocketKeepAlive = (request, { keepAlive, keepAliveMsecs }, deferTimeMs = set_socket_keep_alive_DEFER_EVENT_LISTENER_TIME) => {
    if (keepAlive !== true) {
        return -1;
    }
    const registerListener = () => {
        if (request.socket) {
            request.socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
        }
        else {
            request.on("socket", (socket) => {
                socket.setKeepAlive(keepAlive, keepAliveMsecs || 0);
            });
        }
    };
    if (deferTimeMs === 0) {
        registerListener();
        return 0;
    }
    return timing.setTimeout(registerListener, deferTimeMs);
};

;// ./node_modules/@smithy/node-http-handler/dist-es/set-socket-timeout.js


const set_socket_timeout_DEFER_EVENT_LISTENER_TIME = 3000;
const setSocketTimeout = (request, reject, timeoutInMs = DEFAULT_REQUEST_TIMEOUT) => {
    const registerTimeout = (offset) => {
        const timeout = timeoutInMs - offset;
        const onTimeout = () => {
            request.destroy();
            reject(Object.assign(new Error(`Connection timed out after ${timeoutInMs} ms`), { name: "TimeoutError" }));
        };
        if (request.socket) {
            request.socket.setTimeout(timeout, onTimeout);
            request.on("close", () => request.socket?.removeListener("timeout", onTimeout));
        }
        else {
            request.setTimeout(timeout, onTimeout);
        }
    };
    if (0 < timeoutInMs && timeoutInMs < 6000) {
        registerTimeout(0);
        return 0;
    }
    return timing.setTimeout(registerTimeout.bind(null, timeoutInMs === 0 ? 0 : set_socket_timeout_DEFER_EVENT_LISTENER_TIME), set_socket_timeout_DEFER_EVENT_LISTENER_TIME);
};

// EXTERNAL MODULE: external "stream"
var external_stream_ = __webpack_require__(2203);
;// ./node_modules/@smithy/node-http-handler/dist-es/write-request-body.js


const MIN_WAIT_TIME = 6000;
async function writeRequestBody(httpRequest, request, maxContinueTimeoutMs = MIN_WAIT_TIME) {
    const headers = request.headers ?? {};
    const expect = headers["Expect"] || headers["expect"];
    let timeoutId = -1;
    let sendBody = true;
    if (expect === "100-continue") {
        sendBody = await Promise.race([
            new Promise((resolve) => {
                timeoutId = Number(timing.setTimeout(() => resolve(true), Math.max(MIN_WAIT_TIME, maxContinueTimeoutMs)));
            }),
            new Promise((resolve) => {
                httpRequest.on("continue", () => {
                    timing.clearTimeout(timeoutId);
                    resolve(true);
                });
                httpRequest.on("response", () => {
                    timing.clearTimeout(timeoutId);
                    resolve(false);
                });
                httpRequest.on("error", () => {
                    timing.clearTimeout(timeoutId);
                    resolve(false);
                });
            }),
        ]);
    }
    if (sendBody) {
        writeBody(httpRequest, request.body);
    }
}
function writeBody(httpRequest, body) {
    if (body instanceof external_stream_.Readable) {
        body.pipe(httpRequest);
        return;
    }
    if (body) {
        if (Buffer.isBuffer(body) || typeof body === "string") {
            httpRequest.end(body);
            return;
        }
        const uint8 = body;
        if (typeof uint8 === "object" &&
            uint8.buffer &&
            typeof uint8.byteOffset === "number" &&
            typeof uint8.byteLength === "number") {
            httpRequest.end(Buffer.from(uint8.buffer, uint8.byteOffset, uint8.byteLength));
            return;
        }
        httpRequest.end(Buffer.from(body));
        return;
    }
    httpRequest.end();
}

;// ./node_modules/@smithy/node-http-handler/dist-es/node-http-handler.js











const DEFAULT_REQUEST_TIMEOUT = 0;
class NodeHttpHandler {
    static create(instanceOrOptions) {
        if (typeof instanceOrOptions?.handle === "function") {
            return instanceOrOptions;
        }
        return new NodeHttpHandler(instanceOrOptions);
    }
    static checkSocketUsage(agent, socketWarningTimestamp, logger = console) {
        const { sockets, requests, maxSockets } = agent;
        if (typeof maxSockets !== "number" || maxSockets === Infinity) {
            return socketWarningTimestamp;
        }
        const interval = 15000;
        if (Date.now() - interval < socketWarningTimestamp) {
            return socketWarningTimestamp;
        }
        if (sockets && requests) {
            for (const origin in sockets) {
                const socketsInUse = sockets[origin]?.length ?? 0;
                const requestsEnqueued = requests[origin]?.length ?? 0;
                if (socketsInUse >= maxSockets && requestsEnqueued >= 2 * maxSockets) {
                    logger?.warn?.(`@smithy/node-http-handler:WARN - socket usage at capacity=${socketsInUse} and ${requestsEnqueued} additional requests are enqueued.
See https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html
or increase socketAcquisitionWarningTimeout=(millis) in the NodeHttpHandler config.`);
                    return Date.now();
                }
            }
        }
        return socketWarningTimestamp;
    }
    constructor(options) {
        this.socketWarningTimestamp = 0;
        this.metadata = { handlerProtocol: "http/1.1" };
        this.configProvider = new Promise((resolve, reject) => {
            if (typeof options === "function") {
                options()
                    .then((_options) => {
                    resolve(this.resolveDefaultConfig(_options));
                })
                    .catch(reject);
            }
            else {
                resolve(this.resolveDefaultConfig(options));
            }
        });
    }
    resolveDefaultConfig(options) {
        const { requestTimeout, connectionTimeout, socketTimeout, socketAcquisitionWarningTimeout, httpAgent, httpsAgent } = options || {};
        const keepAlive = true;
        const maxSockets = 50;
        return {
            connectionTimeout,
            requestTimeout: requestTimeout ?? socketTimeout,
            socketAcquisitionWarningTimeout,
            httpAgent: (() => {
                if (httpAgent instanceof external_http_.Agent || typeof httpAgent?.destroy === "function") {
                    return httpAgent;
                }
                return new external_http_.Agent({ keepAlive, maxSockets, ...httpAgent });
            })(),
            httpsAgent: (() => {
                if (httpsAgent instanceof external_https_namespaceObject.Agent || typeof httpsAgent?.destroy === "function") {
                    return httpsAgent;
                }
                return new external_https_namespaceObject.Agent({ keepAlive, maxSockets, ...httpsAgent });
            })(),
            logger: console,
        };
    }
    destroy() {
        this.config?.httpAgent?.destroy();
        this.config?.httpsAgent?.destroy();
    }
    async handle(request, { abortSignal, requestTimeout } = {}) {
        if (!this.config) {
            this.config = await this.configProvider;
        }
        return new Promise((_resolve, _reject) => {
            let writeRequestBodyPromise = undefined;
            const timeouts = [];
            const resolve = async (arg) => {
                await writeRequestBodyPromise;
                timeouts.forEach(timing.clearTimeout);
                _resolve(arg);
            };
            const reject = async (arg) => {
                await writeRequestBodyPromise;
                timeouts.forEach(timing.clearTimeout);
                _reject(arg);
            };
            if (!this.config) {
                throw new Error("Node HTTP request handler config is not resolved");
            }
            if (abortSignal?.aborted) {
                const abortError = new Error("Request aborted");
                abortError.name = "AbortError";
                reject(abortError);
                return;
            }
            const isSSL = request.protocol === "https:";
            const agent = isSSL ? this.config.httpsAgent : this.config.httpAgent;
            timeouts.push(timing.setTimeout(() => {
                this.socketWarningTimestamp = NodeHttpHandler.checkSocketUsage(agent, this.socketWarningTimestamp, this.config.logger);
            }, this.config.socketAcquisitionWarningTimeout ??
                (this.config.requestTimeout ?? 2000) + (this.config.connectionTimeout ?? 1000)));
            const queryString = buildQueryString(request.query || {});
            let auth = undefined;
            if (request.username != null || request.password != null) {
                const username = request.username ?? "";
                const password = request.password ?? "";
                auth = `${username}:${password}`;
            }
            let path = request.path;
            if (queryString) {
                path += `?${queryString}`;
            }
            if (request.fragment) {
                path += `#${request.fragment}`;
            }
            let hostname = request.hostname ?? "";
            if (hostname[0] === "[" && hostname.endsWith("]")) {
                hostname = request.hostname.slice(1, -1);
            }
            else {
                hostname = request.hostname;
            }
            const nodeHttpsOptions = {
                headers: request.headers,
                host: hostname,
                method: request.method,
                path,
                port: request.port,
                agent,
                auth,
            };
            const requestFunc = isSSL ? external_https_namespaceObject.request : external_http_.request;
            const req = requestFunc(nodeHttpsOptions, (res) => {
                const httpResponse = new dist_es_httpResponse/* HttpResponse */.c({
                    statusCode: res.statusCode || -1,
                    reason: res.statusMessage,
                    headers: getTransformedHeaders(res.headers),
                    body: res,
                });
                resolve({ response: httpResponse });
            });
            req.on("error", (err) => {
                if (NODEJS_TIMEOUT_ERROR_CODES.includes(err.code)) {
                    reject(Object.assign(err, { name: "TimeoutError" }));
                }
                else {
                    reject(err);
                }
            });
            if (abortSignal) {
                const onAbort = () => {
                    req.destroy();
                    const abortError = new Error("Request aborted");
                    abortError.name = "AbortError";
                    reject(abortError);
                };
                if (typeof abortSignal.addEventListener === "function") {
                    const signal = abortSignal;
                    signal.addEventListener("abort", onAbort, { once: true });
                    req.once("close", () => signal.removeEventListener("abort", onAbort));
                }
                else {
                    abortSignal.onabort = onAbort;
                }
            }
            const effectiveRequestTimeout = requestTimeout ?? this.config.requestTimeout;
            timeouts.push(setConnectionTimeout(req, reject, this.config.connectionTimeout));
            timeouts.push(setSocketTimeout(req, reject, effectiveRequestTimeout));
            const httpAgent = nodeHttpsOptions.agent;
            if (typeof httpAgent === "object" && "keepAlive" in httpAgent) {
                timeouts.push(setSocketKeepAlive(req, {
                    keepAlive: httpAgent.keepAlive,
                    keepAliveMsecs: httpAgent.keepAliveMsecs,
                }));
            }
            writeRequestBodyPromise = writeRequestBody(req, request, effectiveRequestTimeout).catch((e) => {
                timeouts.forEach(timing.clearTimeout);
                return _reject(e);
            });
        });
    }
    updateHttpClientConfig(key, value) {
        this.config = undefined;
        this.configProvider = this.configProvider.then((config) => {
            return {
                ...config,
                [key]: value,
            };
        });
    }
    httpHandlerConfigs() {
        return this.config ?? {};
    }
}


/***/ }),

/***/ 2927:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ getHttpHandlerExtensionConfiguration),
/* harmony export */   j: () => (/* binding */ resolveHttpHandlerRuntimeConfig)
/* harmony export */ });
const getHttpHandlerExtensionConfiguration = (runtimeConfig) => {
    return {
        setHttpHandler(handler) {
            runtimeConfig.httpHandler = handler;
        },
        httpHandler() {
            return runtimeConfig.httpHandler;
        },
        updateHttpClientConfig(key, value) {
            runtimeConfig.httpHandler?.updateHttpClientConfig(key, value);
        },
        httpHandlerConfigs() {
            return runtimeConfig.httpHandler.httpHandlerConfigs();
        },
    };
};
const resolveHttpHandlerRuntimeConfig = (httpHandlerExtensionConfiguration) => {
    return {
        httpHandler: httpHandlerExtensionConfiguration.httpHandler(),
    };
};


/***/ }),

/***/ 2967:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   j: () => (/* binding */ withBaseException)
/* harmony export */ });
/* unused harmony export throwDefaultError */
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4384);

const throwDefaultError = ({ output, parsedBody, exceptionCtor, errorCode }) => {
    const $metadata = deserializeMetadata(output);
    const statusCode = $metadata.httpStatusCode ? $metadata.httpStatusCode + "" : undefined;
    const response = new exceptionCtor({
        name: parsedBody?.code || parsedBody?.Code || errorCode || statusCode || "UnknownError",
        $fault: "client",
        $metadata,
    });
    throw (0,_exceptions__WEBPACK_IMPORTED_MODULE_0__/* .decorateServiceException */ .M)(response, parsedBody);
};
const withBaseException = (ExceptionCtor) => {
    return ({ output, parsedBody, errorCode }) => {
        throwDefaultError({ output, parsedBody, exceptionCtor: ExceptionCtor, errorCode });
    };
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});


/***/ }),

/***/ 3052:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ CredentialsProviderError)
/* harmony export */ });
/* harmony import */ var _ProviderError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6014);

class CredentialsProviderError extends _ProviderError__WEBPACK_IMPORTED_MODULE_0__/* .ProviderError */ .m {
    constructor(message, options = true) {
        super(message, options);
        this.name = "CredentialsProviderError";
        Object.setPrototypeOf(this, CredentialsProviderError.prototype);
    }
}


/***/ }),

/***/ 3466:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ SelectorType)
/* harmony export */ });
var SelectorType;
(function (SelectorType) {
    SelectorType["ENV"] = "env";
    SelectorType["CONFIG"] = "shared config entry";
})(SelectorType || (SelectorType = {}));


/***/ }),

/***/ 3695:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ isArrayBuffer)
/* harmony export */ });
const isArrayBuffer = (arg) => (typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer) ||
    Object.prototype.toString.call(arg) === "[object ArrayBuffer]";


/***/ }),

/***/ 3783:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ memoize)
/* harmony export */ });
const memoize = (provider, isExpired, requiresRefresh) => {
    let resolved;
    let pending;
    let hasResult;
    let isConstant = false;
    const coalesceProvider = async () => {
        if (!pending) {
            pending = provider();
        }
        try {
            resolved = await pending;
            hasResult = true;
            isConstant = false;
        }
        finally {
            pending = undefined;
        }
        return resolved;
    };
    if (isExpired === undefined) {
        return async (options) => {
            if (!hasResult || options?.forceRefresh) {
                resolved = await coalesceProvider();
            }
            return resolved;
        };
    }
    return async (options) => {
        if (!hasResult || options?.forceRefresh) {
            resolved = await coalesceProvider();
        }
        if (isConstant) {
            return resolved;
        }
        if (requiresRefresh && !requiresRefresh(resolved)) {
            isConstant = true;
            return resolved;
        }
        if (isExpired(resolved)) {
            await coalesceProvider();
            return resolved;
        }
        return resolved;
    };
};


/***/ }),

/***/ 4013:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ loadConfig)
});

// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/memoize.js
var memoize = __webpack_require__(3783);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/chain.js
var chain = __webpack_require__(8062);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/CredentialsProviderError.js
var CredentialsProviderError = __webpack_require__(3052);
;// ./node_modules/@smithy/node-config-provider/dist-es/getSelectorName.js
function getSelectorName(functionString) {
    try {
        const constants = new Set(Array.from(functionString.match(/([A-Z_]){3,}/g) ?? []));
        constants.delete("CONFIG");
        constants.delete("CONFIG_PREFIX_SEPARATOR");
        constants.delete("ENV");
        return [...constants].join(", ");
    }
    catch (e) {
        return functionString;
    }
}

;// ./node_modules/@smithy/node-config-provider/dist-es/fromEnv.js


const fromEnv = (envVarSelector, options) => async () => {
    try {
        const config = envVarSelector(process.env, options);
        if (config === undefined) {
            throw new Error();
        }
        return config;
    }
    catch (e) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C(e.message || `Not found in ENV: ${getSelectorName(envVarSelector.toString())}`, { logger: options?.logger });
    }
};

// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getProfileName.js
var getProfileName = __webpack_require__(6437);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/loadSharedConfigFiles.js + 2 modules
var loadSharedConfigFiles = __webpack_require__(5546);
;// ./node_modules/@smithy/node-config-provider/dist-es/fromSharedConfigFiles.js



const fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
    const profile = (0,getProfileName/* getProfileName */.Bz)(init);
    const { configFile, credentialsFile } = await (0,loadSharedConfigFiles/* loadSharedConfigFiles */.p)(init);
    const profileFromCredentials = credentialsFile[profile] || {};
    const profileFromConfig = configFile[profile] || {};
    const mergedProfile = preferredFile === "config"
        ? { ...profileFromCredentials, ...profileFromConfig }
        : { ...profileFromConfig, ...profileFromCredentials };
    try {
        const cfgFile = preferredFile === "config" ? configFile : credentialsFile;
        const configValue = configSelector(mergedProfile, cfgFile);
        if (configValue === undefined) {
            throw new Error();
        }
        return configValue;
    }
    catch (e) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C(e.message || `Not found in config files w/ profile [${profile}]: ${getSelectorName(configSelector.toString())}`, { logger: init.logger });
    }
};

;// ./node_modules/@smithy/property-provider/dist-es/fromStatic.js
const fromStatic = (staticValue) => () => Promise.resolve(staticValue);

;// ./node_modules/@smithy/node-config-provider/dist-es/fromStatic.js

const isFunction = (func) => typeof func === "function";
const fromStatic_fromStatic = (defaultValue) => isFunction(defaultValue) ? async () => await defaultValue() : fromStatic(defaultValue);

;// ./node_modules/@smithy/node-config-provider/dist-es/configLoader.js




const loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => {
    const { signingName, logger } = configuration;
    const envOptions = { signingName, logger };
    return (0,memoize/* memoize */.B)((0,chain/* chain */.c)(fromEnv(environmentVariableSelector, envOptions), fromSharedConfigFiles(configFileSelector, configuration), fromStatic_fromStatic(defaultValue)));
};


/***/ }),

/***/ 4094:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ HttpResponse)
/* harmony export */ });
class HttpResponse {
    constructor(options) {
        this.statusCode = options.statusCode;
        this.reason = options.reason;
        this.headers = options.headers || {};
        this.body = options.body;
    }
    static isInstance(response) {
        if (!response)
            return false;
        const resp = response;
        return typeof resp.statusCode === "number" && typeof resp.headers === "object";
    }
}


/***/ }),

/***/ 4098:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ NoOpLogger)
/* harmony export */ });
class NoOpLogger {
    trace() { }
    debug() { }
    info() { }
    warn() { }
    error() { }
}


/***/ }),

/***/ 4163:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ resolveAwsRegionExtensionConfiguration),
/* harmony export */   R: () => (/* binding */ getAwsRegionExtensionConfiguration)
/* harmony export */ });
const getAwsRegionExtensionConfiguration = (runtimeConfig) => {
    return {
        setRegion(region) {
            runtimeConfig.region = region;
        },
        region() {
            return runtimeConfig.region;
        },
    };
};
const resolveAwsRegionExtensionConfiguration = (awsRegionExtensionConfiguration) => {
    return {
        region: awsRegionExtensionConfiguration.region(),
    };
};


/***/ }),

/***/ 4303:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  T: () => (/* binding */ resolveRegionConfig)
});

;// ./node_modules/@smithy/config-resolver/dist-es/regionConfig/isFipsRegion.js
const isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));

;// ./node_modules/@smithy/config-resolver/dist-es/regionConfig/getRealRegion.js

const getRealRegion = (region) => isFipsRegion(region)
    ? ["fips-aws-global", "aws-fips"].includes(region)
        ? "us-east-1"
        : region.replace(/fips-(dkr-|prod-)?|-fips/, "")
    : region;

;// ./node_modules/@smithy/config-resolver/dist-es/regionConfig/resolveRegionConfig.js


const resolveRegionConfig = (input) => {
    const { region, useFipsEndpoint } = input;
    if (!region) {
        throw new Error("Region is missing");
    }
    return Object.assign(input, {
        region: async () => {
            if (typeof region === "string") {
                return getRealRegion(region);
            }
            const providedRegion = await region();
            return getRealRegion(providedRegion);
        },
        useFipsEndpoint: async () => {
            const providedRegion = typeof region === "string" ? region : await region();
            if (isFipsRegion(providedRegion)) {
                return true;
            }
            return typeof useFipsEndpoint !== "function" ? Promise.resolve(!!useFipsEndpoint) : useFipsEndpoint();
        },
    });
};


/***/ }),

/***/ 4367:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ normalizeProvider)
/* harmony export */ });
const normalizeProvider = (input) => {
    if (typeof input === "function")
        return input;
    const promisified = Promise.resolve(input);
    return () => promisified;
};


/***/ }),

/***/ 4384:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ decorateServiceException),
/* harmony export */   T: () => (/* binding */ ServiceException)
/* harmony export */ });
class ServiceException extends Error {
    constructor(options) {
        super(options.message);
        Object.setPrototypeOf(this, Object.getPrototypeOf(this).constructor.prototype);
        this.name = options.name;
        this.$fault = options.$fault;
        this.$metadata = options.$metadata;
    }
    static isInstance(value) {
        if (!value)
            return false;
        const candidate = value;
        return (ServiceException.prototype.isPrototypeOf(candidate) ||
            (Boolean(candidate.$fault) &&
                Boolean(candidate.$metadata) &&
                (candidate.$fault === "client" || candidate.$fault === "server")));
    }
    static [Symbol.hasInstance](instance) {
        if (!instance)
            return false;
        const candidate = instance;
        if (this === ServiceException) {
            return ServiceException.isInstance(instance);
        }
        if (ServiceException.isInstance(instance)) {
            if (candidate.name && this.name) {
                return this.prototype.isPrototypeOf(instance) || candidate.name === this.name;
            }
            return this.prototype.isPrototypeOf(instance);
        }
        return false;
    }
}
const decorateServiceException = (exception, additions = {}) => {
    Object.entries(additions)
        .filter(([, v]) => v !== undefined)
        .forEach(([k, v]) => {
        if (exception[k] == undefined || exception[k] === "") {
            exception[k] = v;
        }
    });
    const message = exception.message || exception.Message || "UnknownError";
    exception.message = message;
    delete exception.Message;
    return exception;
};


/***/ }),

/***/ 4424:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ toUint8Array)
/* harmony export */ });
/* harmony import */ var _fromUtf8__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7459);

const toUint8Array = (data) => {
    if (typeof data === "string") {
        return (0,_fromUtf8__WEBPACK_IMPORTED_MODULE_0__/* .fromUtf8 */ .a)(data);
    }
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    }
    return new Uint8Array(data);
};


/***/ }),

/***/ 4472:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  $: () => (/* binding */ NODE_AUTH_SCHEME_PREFERENCE_OPTIONS)
});

;// ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getArrayForCommaSeparatedString.js
const getArrayForCommaSeparatedString = (str) => typeof str === "string" && str.length > 0 ? str.split(",").map((item) => item.trim()) : [];

;// ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getBearerTokenEnvKey.js
const getBearerTokenEnvKey = (signingName) => `AWS_BEARER_TOKEN_${signingName.replace(/[\s-]/g, "_").toUpperCase()}`;

;// ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/NODE_AUTH_SCHEME_PREFERENCE_OPTIONS.js


const NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY = "AWS_AUTH_SCHEME_PREFERENCE";
const NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY = "auth_scheme_preference";
const NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = {
    environmentVariableSelector: (env, options) => {
        if (options?.signingName) {
            const bearerTokenKey = getBearerTokenEnvKey(options.signingName);
            if (bearerTokenKey in env)
                return ["httpBearerAuth"];
        }
        if (!(NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY in env))
            return undefined;
        return getArrayForCommaSeparatedString(env[NODE_AUTH_SCHEME_PREFERENCE_ENV_KEY]);
    },
    configFileSelector: (profile) => {
        if (!(NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY in profile))
            return undefined;
        return getArrayForCommaSeparatedString(profile[NODE_AUTH_SCHEME_PREFERENCE_CONFIG_KEY]);
    },
    default: [],
};


/***/ }),

/***/ 4542:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  GQ: () => (/* binding */ isServerError),
  Qb: () => (/* binding */ isThrottlingError),
  bV: () => (/* binding */ isTransientError)
});

// UNUSED EXPORTS: isBrowserNetworkError, isClockSkewCorrectedError, isClockSkewError, isRetryableByTrait

;// ./node_modules/@smithy/service-error-classification/dist-es/constants.js
const constants_CLOCK_SKEW_ERROR_CODES = (/* unused pure expression or super */ null && ([
    "AuthFailure",
    "InvalidSignatureException",
    "RequestExpired",
    "RequestInTheFuture",
    "RequestTimeTooSkewed",
    "SignatureDoesNotMatch",
]));
const THROTTLING_ERROR_CODES = [
    "BandwidthLimitExceeded",
    "EC2ThrottledException",
    "LimitExceededException",
    "PriorRequestNotComplete",
    "ProvisionedThroughputExceededException",
    "RequestLimitExceeded",
    "RequestThrottled",
    "RequestThrottledException",
    "SlowDown",
    "ThrottledException",
    "Throttling",
    "ThrottlingException",
    "TooManyRequestsException",
    "TransactionInProgressException",
];
const TRANSIENT_ERROR_CODES = ["TimeoutError", "RequestTimeout", "RequestTimeoutException"];
const TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];
const NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "ECONNREFUSED", "EPIPE", "ETIMEDOUT"];
const NODEJS_NETWORK_ERROR_CODES = ["EHOSTUNREACH", "ENETUNREACH", "ENOTFOUND"];

;// ./node_modules/@smithy/service-error-classification/dist-es/index.js

const isRetryableByTrait = (error) => error?.$retryable !== undefined;
const isClockSkewError = (error) => CLOCK_SKEW_ERROR_CODES.includes(error.name);
const isClockSkewCorrectedError = (error) => error.$metadata?.clockSkewCorrected;
const isBrowserNetworkError = (error) => {
    const errorMessages = new Set([
        "Failed to fetch",
        "NetworkError when attempting to fetch resource",
        "The Internet connection appears to be offline",
        "Load failed",
        "Network request failed",
    ]);
    const isValid = error && error instanceof TypeError;
    if (!isValid) {
        return false;
    }
    return errorMessages.has(error.message);
};
const isThrottlingError = (error) => error.$metadata?.httpStatusCode === 429 ||
    THROTTLING_ERROR_CODES.includes(error.name) ||
    error.$retryable?.throttling == true;
const isTransientError = (error, depth = 0) => isRetryableByTrait(error) ||
    isClockSkewCorrectedError(error) ||
    TRANSIENT_ERROR_CODES.includes(error.name) ||
    NODEJS_TIMEOUT_ERROR_CODES.includes(error?.code || "") ||
    NODEJS_NETWORK_ERROR_CODES.includes(error?.code || "") ||
    TRANSIENT_ERROR_STATUS_CODES.includes(error.$metadata?.httpStatusCode || 0) ||
    isBrowserNetworkError(error) ||
    (error.cause !== undefined && depth <= 10 && isTransientError(error.cause, depth + 1));
const isServerError = (error) => {
    if (error.$metadata?.httpStatusCode !== undefined) {
        const statusCode = error.$metadata.httpStatusCode;
        if (500 <= statusCode && statusCode <= 599 && !isTransientError(error)) {
            return true;
        }
        return false;
    }
    return false;
};


/***/ }),

/***/ 4547:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 4570:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ko: () => (/* binding */ NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS)
/* harmony export */ });
/* unused harmony exports ENV_USE_FIPS_ENDPOINT, CONFIG_USE_FIPS_ENDPOINT, DEFAULT_USE_FIPS_ENDPOINT */
/* harmony import */ var _smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5938);
/* harmony import */ var _smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3466);

const ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
const CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
const DEFAULT_USE_FIPS_ENDPOINT = false;
const NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => (0,_smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_0__/* .booleanSelector */ .Q)(env, ENV_USE_FIPS_ENDPOINT, _smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_1__/* .SelectorType */ .c.ENV),
    configFileSelector: (profile) => (0,_smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_0__/* .booleanSelector */ .Q)(profile, CONFIG_USE_FIPS_ENDPOINT, _smithy_util_config_provider__WEBPACK_IMPORTED_MODULE_1__/* .SelectorType */ .c.CONFIG),
    default: false,
};


/***/ }),

/***/ 4836:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GG: () => (/* binding */ NODE_REGION_CONFIG_OPTIONS),
/* harmony export */   zH: () => (/* binding */ NODE_REGION_CONFIG_FILE_OPTIONS)
/* harmony export */ });
/* unused harmony exports REGION_ENV_NAME, REGION_INI_NAME */
const REGION_ENV_NAME = "AWS_REGION";
const REGION_INI_NAME = "region";
const NODE_REGION_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[REGION_ENV_NAME],
    configFileSelector: (profile) => profile[REGION_INI_NAME],
    default: () => {
        throw new Error("Region is missing");
    },
};
const NODE_REGION_CONFIG_FILE_OPTIONS = {
    preferredFile: "credentials",
};


/***/ }),

/***/ 5144:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  ey: () => (/* binding */ getRetryPlugin)
});

// UNUSED EXPORTS: getRetryAfterHint, retryMiddleware, retryMiddlewareOptions

// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var httpRequest = __webpack_require__(7324);
// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpResponse.js
var httpResponse = __webpack_require__(4094);
// EXTERNAL MODULE: ./node_modules/@smithy/service-error-classification/dist-es/index.js + 1 modules
var dist_es = __webpack_require__(4542);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js
var NoOpLogger = __webpack_require__(4098);
// EXTERNAL MODULE: ./node_modules/@smithy/util-retry/dist-es/constants.js
var constants = __webpack_require__(7072);
// EXTERNAL MODULE: external "crypto"
var external_crypto_ = __webpack_require__(6982);
var external_crypto_default = /*#__PURE__*/__webpack_require__.n(external_crypto_);
;// ./node_modules/@smithy/uuid/dist-es/randomUUID.js

const randomUUID = external_crypto_default().randomUUID.bind((external_crypto_default()));

;// ./node_modules/@smithy/uuid/dist-es/v4.js

const decimalToHex = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
const v4 = () => {
    if (randomUUID) {
        return randomUUID();
    }
    const rnds = new Uint8Array(16);
    crypto.getRandomValues(rnds);
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    return (decimalToHex[rnds[0]] +
        decimalToHex[rnds[1]] +
        decimalToHex[rnds[2]] +
        decimalToHex[rnds[3]] +
        "-" +
        decimalToHex[rnds[4]] +
        decimalToHex[rnds[5]] +
        "-" +
        decimalToHex[rnds[6]] +
        decimalToHex[rnds[7]] +
        "-" +
        decimalToHex[rnds[8]] +
        decimalToHex[rnds[9]] +
        "-" +
        decimalToHex[rnds[10]] +
        decimalToHex[rnds[11]] +
        decimalToHex[rnds[12]] +
        decimalToHex[rnds[13]] +
        decimalToHex[rnds[14]] +
        decimalToHex[rnds[15]]);
};

// EXTERNAL MODULE: external "stream"
var external_stream_ = __webpack_require__(2203);
;// ./node_modules/@smithy/middleware-retry/dist-es/isStreamingPayload/isStreamingPayload.js

const isStreamingPayload = (request) => request?.body instanceof external_stream_.Readable ||
    (typeof ReadableStream !== "undefined" && request?.body instanceof ReadableStream);

;// ./node_modules/@smithy/middleware-retry/dist-es/util.js
const asSdkError = (error) => {
    if (error instanceof Error)
        return error;
    if (error instanceof Object)
        return Object.assign(new Error(), error);
    if (typeof error === "string")
        return new Error(error);
    return new Error(`AWS SDK error wrapper for ${error}`);
};

;// ./node_modules/@smithy/middleware-retry/dist-es/retryMiddleware.js







const retryMiddleware = (options) => (next, context) => async (args) => {
    let retryStrategy = await options.retryStrategy();
    const maxAttempts = await options.maxAttempts();
    if (isRetryStrategyV2(retryStrategy)) {
        retryStrategy = retryStrategy;
        let retryToken = await retryStrategy.acquireInitialRetryToken(context["partition_id"]);
        let lastError = new Error();
        let attempts = 0;
        let totalRetryDelay = 0;
        const { request } = args;
        const isRequest = httpRequest/* HttpRequest */.K.isInstance(request);
        if (isRequest) {
            request.headers[constants/* INVOCATION_ID_HEADER */.l5] = v4();
        }
        while (true) {
            try {
                if (isRequest) {
                    request.headers[constants/* REQUEST_HEADER */.ok] = `attempt=${attempts + 1}; max=${maxAttempts}`;
                }
                const { response, output } = await next(args);
                retryStrategy.recordSuccess(retryToken);
                output.$metadata.attempts = attempts + 1;
                output.$metadata.totalRetryDelay = totalRetryDelay;
                return { response, output };
            }
            catch (e) {
                const retryErrorInfo = getRetryErrorInfo(e);
                lastError = asSdkError(e);
                if (isRequest && isStreamingPayload(request)) {
                    (context.logger instanceof NoOpLogger/* NoOpLogger */.N ? console : context.logger)?.warn("An error was encountered in a non-retryable streaming request.");
                    throw lastError;
                }
                try {
                    retryToken = await retryStrategy.refreshRetryTokenForRetry(retryToken, retryErrorInfo);
                }
                catch (refreshError) {
                    if (!lastError.$metadata) {
                        lastError.$metadata = {};
                    }
                    lastError.$metadata.attempts = attempts + 1;
                    lastError.$metadata.totalRetryDelay = totalRetryDelay;
                    throw lastError;
                }
                attempts = retryToken.getRetryCount();
                const delay = retryToken.getRetryDelay();
                totalRetryDelay += delay;
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    else {
        retryStrategy = retryStrategy;
        if (retryStrategy?.mode)
            context.userAgent = [...(context.userAgent || []), ["cfg/retry-mode", retryStrategy.mode]];
        return retryStrategy.retry(next, args);
    }
};
const isRetryStrategyV2 = (retryStrategy) => typeof retryStrategy.acquireInitialRetryToken !== "undefined" &&
    typeof retryStrategy.refreshRetryTokenForRetry !== "undefined" &&
    typeof retryStrategy.recordSuccess !== "undefined";
const getRetryErrorInfo = (error) => {
    const errorInfo = {
        error,
        errorType: getRetryErrorType(error),
    };
    const retryAfterHint = getRetryAfterHint(error.$response);
    if (retryAfterHint) {
        errorInfo.retryAfterHint = retryAfterHint;
    }
    return errorInfo;
};
const getRetryErrorType = (error) => {
    if ((0,dist_es/* isThrottlingError */.Qb)(error))
        return "THROTTLING";
    if ((0,dist_es/* isTransientError */.bV)(error))
        return "TRANSIENT";
    if ((0,dist_es/* isServerError */.GQ)(error))
        return "SERVER_ERROR";
    return "CLIENT_ERROR";
};
const retryMiddlewareOptions = {
    name: "retryMiddleware",
    tags: ["RETRY"],
    step: "finalizeRequest",
    priority: "high",
    override: true,
};
const getRetryPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(retryMiddleware(options), retryMiddlewareOptions);
    },
});
const getRetryAfterHint = (response) => {
    if (!httpResponse/* HttpResponse */.c.isInstance(response))
        return;
    const retryAfterHeaderName = Object.keys(response.headers).find((key) => key.toLowerCase() === "retry-after");
    if (!retryAfterHeaderName)
        return;
    const retryAfter = response.headers[retryAfterHeaderName];
    const retryAfterSeconds = Number(retryAfter);
    if (!Number.isNaN(retryAfterSeconds))
        return new Date(retryAfterSeconds * 1000);
    const retryAfterDate = new Date(retryAfter);
    return retryAfterDate;
};


/***/ }),

/***/ 5172:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  l: () => (/* binding */ getHttpSigningPlugin)
});

// UNUSED EXPORTS: httpSigningMiddlewareOptions

// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var httpRequest = __webpack_require__(7324);
// EXTERNAL MODULE: ./node_modules/@smithy/util-middleware/dist-es/getSmithyContext.js
var getSmithyContext = __webpack_require__(6116);
;// ./node_modules/@smithy/core/dist-es/middleware-http-signing/httpSigningMiddleware.js


const defaultErrorHandler = (signingProperties) => (error) => {
    throw error;
};
const defaultSuccessHandler = (httpResponse, signingProperties) => { };
const httpSigningMiddleware = (config) => (next, context) => async (args) => {
    if (!httpRequest/* HttpRequest */.K.isInstance(args.request)) {
        return next(args);
    }
    const smithyContext = (0,getSmithyContext/* getSmithyContext */.u)(context);
    const scheme = smithyContext.selectedHttpAuthScheme;
    if (!scheme) {
        throw new Error(`No HttpAuthScheme was selected: unable to sign request`);
    }
    const { httpAuthOption: { signingProperties = {} }, identity, signer, } = scheme;
    const output = await next({
        ...args,
        request: await signer.sign(args.request, identity, signingProperties),
    }).catch((signer.errorHandler || defaultErrorHandler)(signingProperties));
    (signer.successHandler || defaultSuccessHandler)(output.response, signingProperties);
    return output;
};

;// ./node_modules/@smithy/core/dist-es/middleware-http-signing/getHttpSigningMiddleware.js

const httpSigningMiddlewareOptions = {
    step: "finalizeRequest",
    tags: ["HTTP_SIGNING"],
    name: "httpSigningMiddleware",
    aliases: ["apiKeyMiddleware", "tokenMiddleware", "awsAuthMiddleware"],
    override: true,
    relation: "after",
    toMiddleware: "retryMiddleware",
};
const getHttpSigningPlugin = (config) => ({
    applyToStack: (clientStack) => {
        clientStack.addRelativeTo(httpSigningMiddleware(config), httpSigningMiddlewareOptions);
    },
});


/***/ }),

/***/ 5178:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  k: () => (/* binding */ streamCollector)
});

// EXTERNAL MODULE: external "stream"
var external_stream_ = __webpack_require__(2203);
;// ./node_modules/@smithy/node-http-handler/dist-es/stream-collector/collector.js

class Collector extends external_stream_.Writable {
    constructor() {
        super(...arguments);
        this.bufferedBytes = [];
    }
    _write(chunk, encoding, callback) {
        this.bufferedBytes.push(chunk);
        callback();
    }
}

;// ./node_modules/@smithy/node-http-handler/dist-es/stream-collector/index.js

const streamCollector = (stream) => {
    if (isReadableStreamInstance(stream)) {
        return collectReadableStream(stream);
    }
    return new Promise((resolve, reject) => {
        const collector = new Collector();
        stream.pipe(collector);
        stream.on("error", (err) => {
            collector.end();
            reject(err);
        });
        collector.on("error", reject);
        collector.on("finish", function () {
            const bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
            resolve(bytes);
        });
    });
};
const isReadableStreamInstance = (stream) => typeof ReadableStream === "function" && stream instanceof ReadableStream;
async function collectReadableStream(stream) {
    const chunks = [];
    const reader = stream.getReader();
    let isDone = false;
    let length = 0;
    while (!isDone) {
        const { done, value } = await reader.read();
        if (value) {
            chunks.push(value);
            length += value.length;
        }
        isDone = done;
    }
    const collected = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
        collected.set(chunk, offset);
        offset += chunk.length;
    }
    return collected;
}


/***/ }),

/***/ 5317:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 5546:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Q: () => (/* binding */ CONFIG_PREFIX_SEPARATOR),
  p: () => (/* binding */ loadSharedConfigFiles)
});

// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(4547);
// EXTERNAL MODULE: ./node_modules/@smithy/types/dist-es/profile.js
var profile = __webpack_require__(5578);
;// ./node_modules/@smithy/shared-ini-file-loader/dist-es/getConfigData.js


const getConfigData = (data) => Object.entries(data)
    .filter(([key]) => {
    const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
    if (indexOfSeparator === -1) {
        return false;
    }
    return Object.values(profile/* IniSectionType */.I).includes(key.substring(0, indexOfSeparator));
})
    .reduce((acc, [key, value]) => {
    const indexOfSeparator = key.indexOf(CONFIG_PREFIX_SEPARATOR);
    const updatedKey = key.substring(0, indexOfSeparator) === profile/* IniSectionType */.I.PROFILE ? key.substring(indexOfSeparator + 1) : key;
    acc[updatedKey] = value;
    return acc;
}, {
    ...(data.default && { default: data.default }),
});

// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getConfigFilepath.js
var getConfigFilepath = __webpack_require__(2432);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getHomeDir.js
var getHomeDir = __webpack_require__(7029);
;// ./node_modules/@smithy/shared-ini-file-loader/dist-es/getCredentialsFilepath.js


const ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
const getCredentialsFilepath = () => process.env[ENV_CREDENTIALS_PATH] || (0,external_path_.join)((0,getHomeDir/* getHomeDir */.R)(), ".aws", "credentials");

// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/parseIni.js
var parseIni = __webpack_require__(1476);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/slurpFile.js
var slurpFile = __webpack_require__(589);
;// ./node_modules/@smithy/shared-ini-file-loader/dist-es/loadSharedConfigFiles.js







const swallowError = () => ({});
const CONFIG_PREFIX_SEPARATOR = ".";
const loadSharedConfigFiles = async (init = {}) => {
    const { filepath = getCredentialsFilepath(), configFilepath = (0,getConfigFilepath/* getConfigFilepath */.g)() } = init;
    const homeDir = (0,getHomeDir/* getHomeDir */.R)();
    const relativeHomeDirPrefix = "~/";
    let resolvedFilepath = filepath;
    if (filepath.startsWith(relativeHomeDirPrefix)) {
        resolvedFilepath = (0,external_path_.join)(homeDir, filepath.slice(2));
    }
    let resolvedConfigFilepath = configFilepath;
    if (configFilepath.startsWith(relativeHomeDirPrefix)) {
        resolvedConfigFilepath = (0,external_path_.join)(homeDir, configFilepath.slice(2));
    }
    const parsedFiles = await Promise.all([
        (0,slurpFile/* slurpFile */.$H)(resolvedConfigFilepath, {
            ignoreCache: init.ignoreCache,
        })
            .then(parseIni/* parseIni */.A)
            .then(getConfigData)
            .catch(swallowError),
        (0,slurpFile/* slurpFile */.$H)(resolvedFilepath, {
            ignoreCache: init.ignoreCache,
        })
            .then(parseIni/* parseIni */.A)
            .catch(swallowError),
    ]);
    return {
        configFile: parsedFiles[0],
        credentialsFile: parsedFiles[1],
    };
};


/***/ }),

/***/ 5578:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ IniSectionType)
/* harmony export */ });
var IniSectionType;
(function (IniSectionType) {
    IniSectionType["PROFILE"] = "profile";
    IniSectionType["SSO_SESSION"] = "sso-session";
    IniSectionType["SERVICES"] = "services";
})(IniSectionType || (IniSectionType = {}));


/***/ }),

/***/ 5938:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ booleanSelector)
/* harmony export */ });
const booleanSelector = (obj, key, type) => {
    if (!(key in obj))
        return undefined;
    if (obj[key] === "true")
        return true;
    if (obj[key] === "false")
        return false;
    throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
};


/***/ }),

/***/ 5963:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  qs: () => (/* binding */ NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
  kN: () => (/* binding */ NODE_RETRY_MODE_CONFIG_OPTIONS),
  $z: () => (/* binding */ resolveRetryConfig)
});

// UNUSED EXPORTS: CONFIG_MAX_ATTEMPTS, CONFIG_RETRY_MODE, ENV_MAX_ATTEMPTS, ENV_RETRY_MODE

// EXTERNAL MODULE: ./node_modules/@smithy/util-middleware/dist-es/normalizeProvider.js
var normalizeProvider = __webpack_require__(8947);
// EXTERNAL MODULE: ./node_modules/@smithy/util-retry/dist-es/config.js
var config = __webpack_require__(7355);
// EXTERNAL MODULE: ./node_modules/@smithy/service-error-classification/dist-es/index.js + 1 modules
var dist_es = __webpack_require__(4542);
;// ./node_modules/@smithy/util-retry/dist-es/DefaultRateLimiter.js

class DefaultRateLimiter {
    constructor(options) {
        this.currentCapacity = 0;
        this.enabled = false;
        this.lastMaxRate = 0;
        this.measuredTxRate = 0;
        this.requestCount = 0;
        this.lastTimestamp = 0;
        this.timeWindow = 0;
        this.beta = options?.beta ?? 0.7;
        this.minCapacity = options?.minCapacity ?? 1;
        this.minFillRate = options?.minFillRate ?? 0.5;
        this.scaleConstant = options?.scaleConstant ?? 0.4;
        this.smooth = options?.smooth ?? 0.8;
        const currentTimeInSeconds = this.getCurrentTimeInSeconds();
        this.lastThrottleTime = currentTimeInSeconds;
        this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
        this.fillRate = this.minFillRate;
        this.maxCapacity = this.minCapacity;
    }
    getCurrentTimeInSeconds() {
        return Date.now() / 1000;
    }
    async getSendToken() {
        return this.acquireTokenBucket(1);
    }
    async acquireTokenBucket(amount) {
        if (!this.enabled) {
            return;
        }
        this.refillTokenBucket();
        if (amount > this.currentCapacity) {
            const delay = ((amount - this.currentCapacity) / this.fillRate) * 1000;
            await new Promise((resolve) => DefaultRateLimiter.setTimeoutFn(resolve, delay));
        }
        this.currentCapacity = this.currentCapacity - amount;
    }
    refillTokenBucket() {
        const timestamp = this.getCurrentTimeInSeconds();
        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
            return;
        }
        const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
        this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
        this.lastTimestamp = timestamp;
    }
    updateClientSendingRate(response) {
        let calculatedRate;
        this.updateMeasuredRate();
        if ((0,dist_es/* isThrottlingError */.Qb)(response)) {
            const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
            this.lastMaxRate = rateToUse;
            this.calculateTimeWindow();
            this.lastThrottleTime = this.getCurrentTimeInSeconds();
            calculatedRate = this.cubicThrottle(rateToUse);
            this.enableTokenBucket();
        }
        else {
            this.calculateTimeWindow();
            calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
        }
        const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
        this.updateTokenBucketRate(newRate);
    }
    calculateTimeWindow() {
        this.timeWindow = this.getPrecise(Math.pow((this.lastMaxRate * (1 - this.beta)) / this.scaleConstant, 1 / 3));
    }
    cubicThrottle(rateToUse) {
        return this.getPrecise(rateToUse * this.beta);
    }
    cubicSuccess(timestamp) {
        return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
    }
    enableTokenBucket() {
        this.enabled = true;
    }
    updateTokenBucketRate(newRate) {
        this.refillTokenBucket();
        this.fillRate = Math.max(newRate, this.minFillRate);
        this.maxCapacity = Math.max(newRate, this.minCapacity);
        this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
    }
    updateMeasuredRate() {
        const t = this.getCurrentTimeInSeconds();
        const timeBucket = Math.floor(t * 2) / 2;
        this.requestCount++;
        if (timeBucket > this.lastTxRateBucket) {
            const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
            this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
            this.requestCount = 0;
            this.lastTxRateBucket = timeBucket;
        }
    }
    getPrecise(num) {
        return parseFloat(num.toFixed(8));
    }
}
DefaultRateLimiter.setTimeoutFn = setTimeout;

// EXTERNAL MODULE: ./node_modules/@smithy/util-retry/dist-es/constants.js
var constants = __webpack_require__(7072);
;// ./node_modules/@smithy/util-retry/dist-es/defaultRetryBackoffStrategy.js

const getDefaultRetryBackoffStrategy = () => {
    let delayBase = constants/* DEFAULT_RETRY_DELAY_BASE */.bp;
    const computeNextBackoffDelay = (attempts) => {
        return Math.floor(Math.min(constants/* MAXIMUM_RETRY_DELAY */.G8, Math.random() * 2 ** attempts * delayBase));
    };
    const setDelayBase = (delay) => {
        delayBase = delay;
    };
    return {
        computeNextBackoffDelay,
        setDelayBase,
    };
};

;// ./node_modules/@smithy/util-retry/dist-es/defaultRetryToken.js

const createDefaultRetryToken = ({ retryDelay, retryCount, retryCost, }) => {
    const getRetryCount = () => retryCount;
    const getRetryDelay = () => Math.min(constants/* MAXIMUM_RETRY_DELAY */.G8, retryDelay);
    const getRetryCost = () => retryCost;
    return {
        getRetryCount,
        getRetryDelay,
        getRetryCost,
    };
};

;// ./node_modules/@smithy/util-retry/dist-es/StandardRetryStrategy.js




class StandardRetryStrategy {
    constructor(maxAttempts) {
        this.maxAttempts = maxAttempts;
        this.mode = config/* RETRY_MODES */.cm.STANDARD;
        this.capacity = constants/* INITIAL_RETRY_TOKENS */.Df;
        this.retryBackoffStrategy = getDefaultRetryBackoffStrategy();
        this.maxAttemptsProvider = typeof maxAttempts === "function" ? maxAttempts : async () => maxAttempts;
    }
    async acquireInitialRetryToken(retryTokenScope) {
        return createDefaultRetryToken({
            retryDelay: constants/* DEFAULT_RETRY_DELAY_BASE */.bp,
            retryCount: 0,
        });
    }
    async refreshRetryTokenForRetry(token, errorInfo) {
        const maxAttempts = await this.getMaxAttempts();
        if (this.shouldRetry(token, errorInfo, maxAttempts)) {
            const errorType = errorInfo.errorType;
            this.retryBackoffStrategy.setDelayBase(errorType === "THROTTLING" ? constants/* THROTTLING_RETRY_DELAY_BASE */.jh : constants/* DEFAULT_RETRY_DELAY_BASE */.bp);
            const delayFromErrorType = this.retryBackoffStrategy.computeNextBackoffDelay(token.getRetryCount());
            const retryDelay = errorInfo.retryAfterHint
                ? Math.max(errorInfo.retryAfterHint.getTime() - Date.now() || 0, delayFromErrorType)
                : delayFromErrorType;
            const capacityCost = this.getCapacityCost(errorType);
            this.capacity -= capacityCost;
            return createDefaultRetryToken({
                retryDelay,
                retryCount: token.getRetryCount() + 1,
                retryCost: capacityCost,
            });
        }
        throw new Error("No retry token available");
    }
    recordSuccess(token) {
        this.capacity = Math.max(constants/* INITIAL_RETRY_TOKENS */.Df, this.capacity + (token.getRetryCost() ?? constants/* NO_RETRY_INCREMENT */.XP));
    }
    getCapacity() {
        return this.capacity;
    }
    async getMaxAttempts() {
        try {
            return await this.maxAttemptsProvider();
        }
        catch (error) {
            console.warn(`Max attempts provider could not resolve. Using default of ${config/* DEFAULT_MAX_ATTEMPTS */.Gz}`);
            return config/* DEFAULT_MAX_ATTEMPTS */.Gz;
        }
    }
    shouldRetry(tokenToRenew, errorInfo, maxAttempts) {
        const attempts = tokenToRenew.getRetryCount() + 1;
        return (attempts < maxAttempts &&
            this.capacity >= this.getCapacityCost(errorInfo.errorType) &&
            this.isRetryableError(errorInfo.errorType));
    }
    getCapacityCost(errorType) {
        return errorType === "TRANSIENT" ? constants/* TIMEOUT_RETRY_COST */.Rn : constants/* RETRY_COST */.XS;
    }
    isRetryableError(errorType) {
        return errorType === "THROTTLING" || errorType === "TRANSIENT";
    }
}

;// ./node_modules/@smithy/util-retry/dist-es/AdaptiveRetryStrategy.js



class AdaptiveRetryStrategy {
    constructor(maxAttemptsProvider, options) {
        this.maxAttemptsProvider = maxAttemptsProvider;
        this.mode = config/* RETRY_MODES */.cm.ADAPTIVE;
        const { rateLimiter } = options ?? {};
        this.rateLimiter = rateLimiter ?? new DefaultRateLimiter();
        this.standardRetryStrategy = new StandardRetryStrategy(maxAttemptsProvider);
    }
    async acquireInitialRetryToken(retryTokenScope) {
        await this.rateLimiter.getSendToken();
        return this.standardRetryStrategy.acquireInitialRetryToken(retryTokenScope);
    }
    async refreshRetryTokenForRetry(tokenToRenew, errorInfo) {
        this.rateLimiter.updateClientSendingRate(errorInfo);
        return this.standardRetryStrategy.refreshRetryTokenForRetry(tokenToRenew, errorInfo);
    }
    recordSuccess(token) {
        this.rateLimiter.updateClientSendingRate({});
        this.standardRetryStrategy.recordSuccess(token);
    }
}

;// ./node_modules/@smithy/middleware-retry/dist-es/configurations.js


const ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
const CONFIG_MAX_ATTEMPTS = "max_attempts";
const NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => {
        const value = env[ENV_MAX_ATTEMPTS];
        if (!value)
            return undefined;
        const maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
            throw new Error(`Environment variable ${ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
        }
        return maxAttempt;
    },
    configFileSelector: (profile) => {
        const value = profile[CONFIG_MAX_ATTEMPTS];
        if (!value)
            return undefined;
        const maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
            throw new Error(`Shared config file entry ${CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
        }
        return maxAttempt;
    },
    default: config/* DEFAULT_MAX_ATTEMPTS */.Gz,
};
const resolveRetryConfig = (input) => {
    const { retryStrategy, retryMode: _retryMode, maxAttempts: _maxAttempts } = input;
    const maxAttempts = (0,normalizeProvider/* normalizeProvider */.t)(_maxAttempts ?? config/* DEFAULT_MAX_ATTEMPTS */.Gz);
    return Object.assign(input, {
        maxAttempts,
        retryStrategy: async () => {
            if (retryStrategy) {
                return retryStrategy;
            }
            const retryMode = await (0,normalizeProvider/* normalizeProvider */.t)(_retryMode)();
            if (retryMode === config/* RETRY_MODES */.cm.ADAPTIVE) {
                return new AdaptiveRetryStrategy(maxAttempts);
            }
            return new StandardRetryStrategy(maxAttempts);
        },
    });
};
const ENV_RETRY_MODE = "AWS_RETRY_MODE";
const CONFIG_RETRY_MODE = "retry_mode";
const NODE_RETRY_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[ENV_RETRY_MODE],
    configFileSelector: (profile) => profile[CONFIG_RETRY_MODE],
    default: config/* DEFAULT_RETRY_MODE */.L0,
};


/***/ }),

/***/ 6014:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ ProviderError)
/* harmony export */ });
class ProviderError extends Error {
    constructor(message, options = true) {
        let logger;
        let tryNextLink = true;
        if (typeof options === "boolean") {
            logger = undefined;
            tryNextLink = options;
        }
        else if (options != null && typeof options === "object") {
            logger = options.logger;
            tryNextLink = options.tryNextLink ?? true;
        }
        super(message);
        this.name = "ProviderError";
        this.tryNextLink = tryNextLink;
        Object.setPrototypeOf(this, ProviderError.prototype);
        logger?.debug?.(`@smithy/property-provider ${tryNextLink ? "->" : "(!)"} ${message}`);
    }
    static from(error, options = true) {
        return Object.assign(new this(error.message, options), error);
    }
}


/***/ }),

/***/ 6116:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: () => (/* binding */ getSmithyContext)
/* harmony export */ });
/* harmony import */ var _smithy_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7267);

const getSmithyContext = (context) => context[_smithy_types__WEBPACK_IMPORTED_MODULE_0__/* .SMITHY_CONTEXT_KEY */ .V] || (context[_smithy_types__WEBPACK_IMPORTED_MODULE_0__/* .SMITHY_CONTEXT_KEY */ .V] = {});


/***/ }),

/***/ 6228:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  f2: () => (/* binding */ AwsSdkSigV4Signer)
});

// UNUSED EXPORTS: AWSSDKSigV4Signer, validateSigningProperties

// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var dist_es_httpRequest = __webpack_require__(7324);
;// ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getSkewCorrectedDate.js
const getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);

// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpResponse.js
var httpResponse = __webpack_require__(4094);
;// ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getDateHeader.js

const getDateHeader = (response) => httpResponse/* HttpResponse */.c.isInstance(response) ? response.headers?.date ?? response.headers?.Date : undefined;

;// ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/isClockSkewed.js

const isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 300000;

;// ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/utils/getUpdatedSystemClockOffset.js

const getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
    const clockTimeInMs = Date.parse(clockTime);
    if (isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
        return clockTimeInMs - Date.now();
    }
    return currentSystemClockOffset;
};

;// ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4Signer.js


const throwSigningPropertyError = (name, property) => {
    if (!property) {
        throw new Error(`Property \`${name}\` is not resolved for AWS SDK SigV4Auth`);
    }
    return property;
};
const validateSigningProperties = async (signingProperties) => {
    const context = throwSigningPropertyError("context", signingProperties.context);
    const config = throwSigningPropertyError("config", signingProperties.config);
    const authScheme = context.endpointV2?.properties?.authSchemes?.[0];
    const signerFunction = throwSigningPropertyError("signer", config.signer);
    const signer = await signerFunction(authScheme);
    const signingRegion = signingProperties?.signingRegion;
    const signingRegionSet = signingProperties?.signingRegionSet;
    const signingName = signingProperties?.signingName;
    return {
        config,
        signer,
        signingRegion,
        signingRegionSet,
        signingName,
    };
};
class AwsSdkSigV4Signer {
    async sign(httpRequest, identity, signingProperties) {
        if (!dist_es_httpRequest/* HttpRequest */.K.isInstance(httpRequest)) {
            throw new Error("The request is not an instance of `HttpRequest` and cannot be signed");
        }
        const validatedProps = await validateSigningProperties(signingProperties);
        const { config, signer } = validatedProps;
        let { signingRegion, signingName } = validatedProps;
        const handlerExecutionContext = signingProperties.context;
        if (handlerExecutionContext?.authSchemes?.length ?? 0 > 1) {
            const [first, second] = handlerExecutionContext.authSchemes;
            if (first?.name === "sigv4a" && second?.name === "sigv4") {
                signingRegion = second?.signingRegion ?? signingRegion;
                signingName = second?.signingName ?? signingName;
            }
        }
        const signedRequest = await signer.sign(httpRequest, {
            signingDate: getSkewCorrectedDate(config.systemClockOffset),
            signingRegion: signingRegion,
            signingService: signingName,
        });
        return signedRequest;
    }
    errorHandler(signingProperties) {
        return (error) => {
            const serverTime = error.ServerTime ?? getDateHeader(error.$response);
            if (serverTime) {
                const config = throwSigningPropertyError("config", signingProperties.config);
                const initialSystemClockOffset = config.systemClockOffset;
                config.systemClockOffset = getUpdatedSystemClockOffset(serverTime, config.systemClockOffset);
                const clockSkewCorrected = config.systemClockOffset !== initialSystemClockOffset;
                if (clockSkewCorrected && error.$metadata) {
                    error.$metadata.clockSkewCorrected = true;
                }
            }
            throw error;
        };
    }
    successHandler(httpResponse, signingProperties) {
        const dateHeader = getDateHeader(httpResponse);
        if (dateHeader) {
            const config = throwSigningPropertyError("config", signingProperties.config);
            config.systemClockOffset = getUpdatedSystemClockOffset(dateHeader, config.systemClockOffset);
        }
    }
}
const AWSSDKSigV4Signer = (/* unused pure expression or super */ null && (AwsSdkSigV4Signer));


/***/ }),

/***/ 6437:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bz: () => (/* binding */ getProfileName),
/* harmony export */   Ch: () => (/* binding */ ENV_PROFILE)
/* harmony export */ });
/* unused harmony export DEFAULT_PROFILE */
const ENV_PROFILE = "AWS_PROFILE";
const DEFAULT_PROFILE = "default";
const getProfileName = (init) => init.profile || process.env[ENV_PROFILE] || DEFAULT_PROFILE;


/***/ }),

/***/ 6460:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ET: () => (/* binding */ expectInt32),
/* harmony export */   UO: () => (/* binding */ strictParseFloat32),
/* harmony export */   Xk: () => (/* binding */ expectObject),
/* harmony export */   Y0: () => (/* binding */ expectNonNull),
/* harmony export */   lK: () => (/* binding */ expectString),
/* harmony export */   tW: () => (/* binding */ strictParseByte),
/* harmony export */   xW: () => (/* binding */ strictParseInt32),
/* harmony export */   zi: () => (/* binding */ strictParseShort)
/* harmony export */ });
/* unused harmony exports parseBoolean, expectBoolean, expectNumber, expectFloat32, expectLong, expectInt, expectShort, expectByte, expectUnion, strictParseDouble, strictParseFloat, limitedParseDouble, handleFloat, limitedParseFloat, limitedParseFloat32, strictParseLong, strictParseInt, logger */
const parseBoolean = (value) => {
    switch (value) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            throw new Error(`Unable to parse boolean value "${value}"`);
    }
};
const expectBoolean = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "number") {
        if (value === 0 || value === 1) {
            logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
        }
        if (value === 0) {
            return false;
        }
        if (value === 1) {
            return true;
        }
    }
    if (typeof value === "string") {
        const lower = value.toLowerCase();
        if (lower === "false" || lower === "true") {
            logger.warn(stackTraceWarning(`Expected boolean, got ${typeof value}: ${value}`));
        }
        if (lower === "false") {
            return false;
        }
        if (lower === "true") {
            return true;
        }
    }
    if (typeof value === "boolean") {
        return value;
    }
    throw new TypeError(`Expected boolean, got ${typeof value}: ${value}`);
};
const expectNumber = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        const parsed = parseFloat(value);
        if (!Number.isNaN(parsed)) {
            if (String(parsed) !== String(value)) {
                logger.warn(stackTraceWarning(`Expected number but observed string: ${value}`));
            }
            return parsed;
        }
    }
    if (typeof value === "number") {
        return value;
    }
    throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
};
const MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
const expectFloat32 = (value) => {
    const expected = expectNumber(value);
    if (expected !== undefined && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
        if (Math.abs(expected) > MAX_FLOAT) {
            throw new TypeError(`Expected 32-bit float, got ${value}`);
        }
    }
    return expected;
};
const expectLong = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (Number.isInteger(value) && !Number.isNaN(value)) {
        return value;
    }
    throw new TypeError(`Expected integer, got ${typeof value}: ${value}`);
};
const expectInt = (/* unused pure expression or super */ null && (expectLong));
const expectInt32 = (value) => expectSizedInt(value, 32);
const expectShort = (value) => expectSizedInt(value, 16);
const expectByte = (value) => expectSizedInt(value, 8);
const expectSizedInt = (value, size) => {
    const expected = expectLong(value);
    if (expected !== undefined && castInt(expected, size) !== expected) {
        throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
    }
    return expected;
};
const castInt = (value, size) => {
    switch (size) {
        case 32:
            return Int32Array.of(value)[0];
        case 16:
            return Int16Array.of(value)[0];
        case 8:
            return Int8Array.of(value)[0];
    }
};
const expectNonNull = (value, location) => {
    if (value === null || value === undefined) {
        if (location) {
            throw new TypeError(`Expected a non-null value for ${location}`);
        }
        throw new TypeError("Expected a non-null value");
    }
    return value;
};
const expectObject = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    const receivedType = Array.isArray(value) ? "array" : typeof value;
    throw new TypeError(`Expected object, got ${receivedType}: ${value}`);
};
const expectString = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        return value;
    }
    if (["boolean", "number", "bigint"].includes(typeof value)) {
        logger.warn(stackTraceWarning(`Expected string, got ${typeof value}: ${value}`));
        return String(value);
    }
    throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
};
const expectUnion = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    const asObject = expectObject(value);
    const setKeys = Object.entries(asObject)
        .filter(([, v]) => v != null)
        .map(([k]) => k);
    if (setKeys.length === 0) {
        throw new TypeError(`Unions must have exactly one non-null member. None were found.`);
    }
    if (setKeys.length > 1) {
        throw new TypeError(`Unions must have exactly one non-null member. Keys ${setKeys} were not null.`);
    }
    return asObject;
};
const strictParseDouble = (value) => {
    if (typeof value == "string") {
        return expectNumber(parseNumber(value));
    }
    return expectNumber(value);
};
const strictParseFloat = (/* unused pure expression or super */ null && (strictParseDouble));
const strictParseFloat32 = (value) => {
    if (typeof value == "string") {
        return expectFloat32(parseNumber(value));
    }
    return expectFloat32(value);
};
const NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
const parseNumber = (value) => {
    const matches = value.match(NUMBER_REGEX);
    if (matches === null || matches[0].length !== value.length) {
        throw new TypeError(`Expected real number, got implicit NaN`);
    }
    return parseFloat(value);
};
const limitedParseDouble = (value) => {
    if (typeof value == "string") {
        return parseFloatString(value);
    }
    return expectNumber(value);
};
const handleFloat = (/* unused pure expression or super */ null && (limitedParseDouble));
const limitedParseFloat = (/* unused pure expression or super */ null && (limitedParseDouble));
const limitedParseFloat32 = (value) => {
    if (typeof value == "string") {
        return parseFloatString(value);
    }
    return expectFloat32(value);
};
const parseFloatString = (value) => {
    switch (value) {
        case "NaN":
            return NaN;
        case "Infinity":
            return Infinity;
        case "-Infinity":
            return -Infinity;
        default:
            throw new Error(`Unable to parse float value: ${value}`);
    }
};
const strictParseLong = (value) => {
    if (typeof value === "string") {
        return expectLong(parseNumber(value));
    }
    return expectLong(value);
};
const strictParseInt = (/* unused pure expression or super */ null && (strictParseLong));
const strictParseInt32 = (value) => {
    if (typeof value === "string") {
        return expectInt32(parseNumber(value));
    }
    return expectInt32(value);
};
const strictParseShort = (value) => {
    if (typeof value === "string") {
        return expectShort(parseNumber(value));
    }
    return expectShort(value);
};
const strictParseByte = (value) => {
    if (typeof value === "string") {
        return expectByte(parseNumber(value));
    }
    return expectByte(value);
};
const stackTraceWarning = (message) => {
    return String(new TypeError(message).stack || message)
        .split("\n")
        .slice(0, 5)
        .filter((s) => !s.includes("stackTraceWarning"))
        .join("\n");
};
const logger = {
    warn: console.warn,
};


/***/ }),

/***/ 6768:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  r: () => (/* binding */ getEndpointPlugin)
});

// UNUSED EXPORTS: endpointMiddlewareOptions

// EXTERNAL MODULE: ./node_modules/@smithy/middleware-serde/dist-es/serdePlugin.js + 2 modules
var serdePlugin = __webpack_require__(1698);
;// ./node_modules/@smithy/core/dist-es/setFeature.js
function setFeature(context, feature, value) {
    if (!context.__smithy_context) {
        context.__smithy_context = {
            features: {},
        };
    }
    else if (!context.__smithy_context.features) {
        context.__smithy_context.features = {};
    }
    context.__smithy_context.features[feature] = value;
}

// EXTERNAL MODULE: ./node_modules/@smithy/util-middleware/dist-es/getSmithyContext.js
var getSmithyContext = __webpack_require__(6116);
;// ./node_modules/@smithy/middleware-endpoint/dist-es/service-customizations/s3.js
const resolveParamsForS3 = async (endpointParams) => {
    const bucket = endpointParams?.Bucket || "";
    if (typeof endpointParams.Bucket === "string") {
        endpointParams.Bucket = bucket.replace(/#/g, encodeURIComponent("#")).replace(/\?/g, encodeURIComponent("?"));
    }
    if (isArnBucketName(bucket)) {
        if (endpointParams.ForcePathStyle === true) {
            throw new Error("Path-style addressing cannot be used with ARN buckets");
        }
    }
    else if (!isDnsCompatibleBucketName(bucket) ||
        (bucket.indexOf(".") !== -1 && !String(endpointParams.Endpoint).startsWith("http:")) ||
        bucket.toLowerCase() !== bucket ||
        bucket.length < 3) {
        endpointParams.ForcePathStyle = true;
    }
    if (endpointParams.DisableMultiRegionAccessPoints) {
        endpointParams.disableMultiRegionAccessPoints = true;
        endpointParams.DisableMRAP = true;
    }
    return endpointParams;
};
const DOMAIN_PATTERN = /^[a-z0-9][a-z0-9\.\-]{1,61}[a-z0-9]$/;
const IP_ADDRESS_PATTERN = /(\d+\.){3}\d+/;
const DOTS_PATTERN = /\.\./;
const DOT_PATTERN = /\./;
const S3_HOSTNAME_PATTERN = /^(.+\.)?s3(-fips)?(\.dualstack)?[.-]([a-z0-9-]+)\./;
const isDnsCompatibleBucketName = (bucketName) => DOMAIN_PATTERN.test(bucketName) && !IP_ADDRESS_PATTERN.test(bucketName) && !DOTS_PATTERN.test(bucketName);
const isArnBucketName = (bucketName) => {
    const [arn, partition, service, , , bucket] = bucketName.split(":");
    const isArn = arn === "arn" && bucketName.split(":").length >= 6;
    const isValidArn = Boolean(isArn && partition && service && bucket);
    if (isArn && !isValidArn) {
        throw new Error(`Invalid ARN: ${bucketName} was an invalid ARN.`);
    }
    return isValidArn;
};

;// ./node_modules/@smithy/middleware-endpoint/dist-es/adaptors/createConfigValueProvider.js
const createConfigValueProvider = (configKey, canonicalEndpointParamKey, config) => {
    const configProvider = async () => {
        const configValue = config[configKey] ?? config[canonicalEndpointParamKey];
        if (typeof configValue === "function") {
            return configValue();
        }
        return configValue;
    };
    if (configKey === "credentialScope" || canonicalEndpointParamKey === "CredentialScope") {
        return async () => {
            const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
            const configValue = credentials?.credentialScope ?? credentials?.CredentialScope;
            return configValue;
        };
    }
    if (configKey === "accountId" || canonicalEndpointParamKey === "AccountId") {
        return async () => {
            const credentials = typeof config.credentials === "function" ? await config.credentials() : config.credentials;
            const configValue = credentials?.accountId ?? credentials?.AccountId;
            return configValue;
        };
    }
    if (configKey === "endpoint" || canonicalEndpointParamKey === "endpoint") {
        return async () => {
            if (config.isCustomEndpoint === false) {
                return undefined;
            }
            const endpoint = await configProvider();
            if (endpoint && typeof endpoint === "object") {
                if ("url" in endpoint) {
                    return endpoint.url.href;
                }
                if ("hostname" in endpoint) {
                    const { protocol, hostname, port, path } = endpoint;
                    return `${protocol}//${hostname}${port ? ":" + port : ""}${path}`;
                }
            }
            return endpoint;
        };
    }
    return configProvider;
};

// EXTERNAL MODULE: ./node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromConfig.js + 1 modules
var getEndpointFromConfig = __webpack_require__(8829);
// EXTERNAL MODULE: ./node_modules/@smithy/middleware-endpoint/dist-es/adaptors/toEndpointV1.js
var toEndpointV1 = __webpack_require__(8462);
;// ./node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromInstructions.js




const getEndpointFromInstructions = async (commandInput, instructionsSupplier, clientConfig, context) => {
    if (!clientConfig.isCustomEndpoint) {
        let endpointFromConfig;
        if (clientConfig.serviceConfiguredEndpoint) {
            endpointFromConfig = await clientConfig.serviceConfiguredEndpoint();
        }
        else {
            endpointFromConfig = await (0,getEndpointFromConfig/* getEndpointFromConfig */.k)(clientConfig.serviceId);
        }
        if (endpointFromConfig) {
            clientConfig.endpoint = () => Promise.resolve((0,toEndpointV1/* toEndpointV1 */.a)(endpointFromConfig));
            clientConfig.isCustomEndpoint = true;
        }
    }
    const endpointParams = await resolveParams(commandInput, instructionsSupplier, clientConfig);
    if (typeof clientConfig.endpointProvider !== "function") {
        throw new Error("config.endpointProvider is not set.");
    }
    const endpoint = clientConfig.endpointProvider(endpointParams, context);
    return endpoint;
};
const resolveParams = async (commandInput, instructionsSupplier, clientConfig) => {
    const endpointParams = {};
    const instructions = instructionsSupplier?.getEndpointParameterInstructions?.() || {};
    for (const [name, instruction] of Object.entries(instructions)) {
        switch (instruction.type) {
            case "staticContextParams":
                endpointParams[name] = instruction.value;
                break;
            case "contextParams":
                endpointParams[name] = commandInput[instruction.name];
                break;
            case "clientContextParams":
            case "builtInParams":
                endpointParams[name] = await createConfigValueProvider(instruction.name, name, clientConfig)();
                break;
            case "operationContextParams":
                endpointParams[name] = instruction.get(commandInput);
                break;
            default:
                throw new Error("Unrecognized endpoint parameter instruction: " + JSON.stringify(instruction));
        }
    }
    if (Object.keys(instructions).length === 0) {
        Object.assign(endpointParams, clientConfig);
    }
    if (String(clientConfig.serviceId).toLowerCase() === "s3") {
        await resolveParamsForS3(endpointParams);
    }
    return endpointParams;
};

;// ./node_modules/@smithy/middleware-endpoint/dist-es/endpointMiddleware.js



const endpointMiddleware = ({ config, instructions, }) => {
    return (next, context) => async (args) => {
        if (config.isCustomEndpoint) {
            setFeature(context, "ENDPOINT_OVERRIDE", "N");
        }
        const endpoint = await getEndpointFromInstructions(args.input, {
            getEndpointParameterInstructions() {
                return instructions;
            },
        }, { ...config }, context);
        context.endpointV2 = endpoint;
        context.authSchemes = endpoint.properties?.authSchemes;
        const authScheme = context.authSchemes?.[0];
        if (authScheme) {
            context["signing_region"] = authScheme.signingRegion;
            context["signing_service"] = authScheme.signingName;
            const smithyContext = (0,getSmithyContext/* getSmithyContext */.u)(context);
            const httpAuthOption = smithyContext?.selectedHttpAuthScheme?.httpAuthOption;
            if (httpAuthOption) {
                httpAuthOption.signingProperties = Object.assign(httpAuthOption.signingProperties || {}, {
                    signing_region: authScheme.signingRegion,
                    signingRegion: authScheme.signingRegion,
                    signing_service: authScheme.signingName,
                    signingName: authScheme.signingName,
                    signingRegionSet: authScheme.signingRegionSet,
                }, authScheme.properties);
            }
        }
        return next({
            ...args,
        });
    };
};

;// ./node_modules/@smithy/middleware-endpoint/dist-es/getEndpointPlugin.js


const endpointMiddlewareOptions = {
    step: "serialize",
    tags: ["ENDPOINT_PARAMETERS", "ENDPOINT_V2", "ENDPOINT"],
    name: "endpointV2Middleware",
    override: true,
    relation: "before",
    toMiddleware: serdePlugin/* serializerMiddlewareOption */.Ou.name,
};
const getEndpointPlugin = (config, instructions) => ({
    applyToStack: (clientStack) => {
        clientStack.addRelativeTo(endpointMiddleware({
            config,
            instructions,
        }), endpointMiddlewareOptions);
    },
});


/***/ }),

/***/ 6909:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ fromArrayBuffer),
/* harmony export */   s: () => (/* binding */ fromString)
/* harmony export */ });
/* harmony import */ var _smithy_is_array_buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3695);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(181);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(buffer__WEBPACK_IMPORTED_MODULE_1__);


const fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
    if (!(0,_smithy_is_array_buffer__WEBPACK_IMPORTED_MODULE_0__/* .isArrayBuffer */ .m)(input)) {
        throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
    }
    return buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer.from(input, offset, length);
};
const fromString = (input, encoding) => {
    if (typeof input !== "string") {
        throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
    }
    return encoding ? buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer.from(input, encoding) : buffer__WEBPACK_IMPORTED_MODULE_1__.Buffer.from(input);
};


/***/ }),

/***/ 6982:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 7016:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 7029:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ getHomeDir)
/* harmony export */ });
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(857);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4547);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);


const homeDirCache = {};
const getHomeDirCacheKey = () => {
    if (process && process.geteuid) {
        return `${process.geteuid()}`;
    }
    return "DEFAULT";
};
const getHomeDir = () => {
    const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${path__WEBPACK_IMPORTED_MODULE_1__.sep}` } = process.env;
    if (HOME)
        return HOME;
    if (USERPROFILE)
        return USERPROFILE;
    if (HOMEPATH)
        return `${HOMEDRIVE}${HOMEPATH}`;
    const homeDirCacheKey = getHomeDirCacheKey();
    if (!homeDirCache[homeDirCacheKey])
        homeDirCache[homeDirCacheKey] = (0,os__WEBPACK_IMPORTED_MODULE_0__.homedir)();
    return homeDirCache[homeDirCacheKey];
};


/***/ }),

/***/ 7072:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Df: () => (/* binding */ INITIAL_RETRY_TOKENS),
/* harmony export */   G8: () => (/* binding */ MAXIMUM_RETRY_DELAY),
/* harmony export */   Rn: () => (/* binding */ TIMEOUT_RETRY_COST),
/* harmony export */   XP: () => (/* binding */ NO_RETRY_INCREMENT),
/* harmony export */   XS: () => (/* binding */ RETRY_COST),
/* harmony export */   bp: () => (/* binding */ DEFAULT_RETRY_DELAY_BASE),
/* harmony export */   jh: () => (/* binding */ THROTTLING_RETRY_DELAY_BASE),
/* harmony export */   l5: () => (/* binding */ INVOCATION_ID_HEADER),
/* harmony export */   ok: () => (/* binding */ REQUEST_HEADER)
/* harmony export */ });
const DEFAULT_RETRY_DELAY_BASE = 100;
const MAXIMUM_RETRY_DELAY = 20 * 1000;
const THROTTLING_RETRY_DELAY_BASE = 500;
const INITIAL_RETRY_TOKENS = 500;
const RETRY_COST = 5;
const TIMEOUT_RETRY_COST = 10;
const NO_RETRY_INCREMENT = 1;
const INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
const REQUEST_HEADER = "amz-sdk-request";


/***/ }),

/***/ 7167:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  s: () => (/* binding */ resolveEndpoint)
});

;// ./node_modules/@smithy/util-endpoints/dist-es/debug/debugId.js
const debugId = "endpoints";

;// ./node_modules/@smithy/util-endpoints/dist-es/debug/toDebugString.js
function toDebugString(input) {
    if (typeof input !== "object" || input == null) {
        return input;
    }
    if ("ref" in input) {
        return `$${toDebugString(input.ref)}`;
    }
    if ("fn" in input) {
        return `${input.fn}(${(input.argv || []).map(toDebugString).join(", ")})`;
    }
    return JSON.stringify(input, null, 2);
}

;// ./node_modules/@smithy/util-endpoints/dist-es/types/EndpointError.js
class EndpointError extends Error {
    constructor(message) {
        super(message);
        this.name = "EndpointError";
    }
}

// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/utils/customEndpointFunctions.js
var customEndpointFunctions = __webpack_require__(468);
;// ./node_modules/@smithy/util-endpoints/dist-es/lib/booleanEquals.js
const booleanEquals = (value1, value2) => value1 === value2;

;// ./node_modules/@smithy/util-endpoints/dist-es/lib/getAttrPathList.js

const getAttrPathList = (path) => {
    const parts = path.split(".");
    const pathList = [];
    for (const part of parts) {
        const squareBracketIndex = part.indexOf("[");
        if (squareBracketIndex !== -1) {
            if (part.indexOf("]") !== part.length - 1) {
                throw new EndpointError(`Path: '${path}' does not end with ']'`);
            }
            const arrayIndex = part.slice(squareBracketIndex + 1, -1);
            if (Number.isNaN(parseInt(arrayIndex))) {
                throw new EndpointError(`Invalid array index: '${arrayIndex}' in path: '${path}'`);
            }
            if (squareBracketIndex !== 0) {
                pathList.push(part.slice(0, squareBracketIndex));
            }
            pathList.push(arrayIndex);
        }
        else {
            pathList.push(part);
        }
    }
    return pathList;
};

;// ./node_modules/@smithy/util-endpoints/dist-es/lib/getAttr.js


const getAttr = (value, path) => getAttrPathList(path).reduce((acc, index) => {
    if (typeof acc !== "object") {
        throw new EndpointError(`Index '${index}' in '${path}' not found in '${JSON.stringify(value)}'`);
    }
    else if (Array.isArray(acc)) {
        return acc[parseInt(index)];
    }
    return acc[index];
}, value);

;// ./node_modules/@smithy/util-endpoints/dist-es/lib/isSet.js
const isSet = (value) => value != null;

// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/lib/isValidHostLabel.js
var isValidHostLabel = __webpack_require__(8883);
;// ./node_modules/@smithy/util-endpoints/dist-es/lib/not.js
const not = (value) => !value;

;// ./node_modules/@smithy/types/dist-es/endpoint.js
var EndpointURLScheme;
(function (EndpointURLScheme) {
    EndpointURLScheme["HTTP"] = "http";
    EndpointURLScheme["HTTPS"] = "https";
})(EndpointURLScheme || (EndpointURLScheme = {}));

// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/lib/isIpAddress.js
var isIpAddress = __webpack_require__(1466);
;// ./node_modules/@smithy/util-endpoints/dist-es/lib/parseURL.js


const DEFAULT_PORTS = {
    [EndpointURLScheme.HTTP]: 80,
    [EndpointURLScheme.HTTPS]: 443,
};
const parseURL = (value) => {
    const whatwgURL = (() => {
        try {
            if (value instanceof URL) {
                return value;
            }
            if (typeof value === "object" && "hostname" in value) {
                const { hostname, port, protocol = "", path = "", query = {} } = value;
                const url = new URL(`${protocol}//${hostname}${port ? `:${port}` : ""}${path}`);
                url.search = Object.entries(query)
                    .map(([k, v]) => `${k}=${v}`)
                    .join("&");
                return url;
            }
            return new URL(value);
        }
        catch (error) {
            return null;
        }
    })();
    if (!whatwgURL) {
        console.error(`Unable to parse ${JSON.stringify(value)} as a whatwg URL.`);
        return null;
    }
    const urlString = whatwgURL.href;
    const { host, hostname, pathname, protocol, search } = whatwgURL;
    if (search) {
        return null;
    }
    const scheme = protocol.slice(0, -1);
    if (!Object.values(EndpointURLScheme).includes(scheme)) {
        return null;
    }
    const isIp = (0,isIpAddress/* isIpAddress */.o)(hostname);
    const inputContainsDefaultPort = urlString.includes(`${host}:${DEFAULT_PORTS[scheme]}`) ||
        (typeof value === "string" && value.includes(`${host}:${DEFAULT_PORTS[scheme]}`));
    const authority = `${host}${inputContainsDefaultPort ? `:${DEFAULT_PORTS[scheme]}` : ``}`;
    return {
        scheme,
        authority,
        path: pathname,
        normalizedPath: pathname.endsWith("/") ? pathname : `${pathname}/`,
        isIp,
    };
};

;// ./node_modules/@smithy/util-endpoints/dist-es/lib/stringEquals.js
const stringEquals = (value1, value2) => value1 === value2;

;// ./node_modules/@smithy/util-endpoints/dist-es/lib/substring.js
const substring = (input, start, stop, reverse) => {
    if (start >= stop || input.length < stop) {
        return null;
    }
    if (!reverse) {
        return input.substring(start, stop);
    }
    return input.substring(input.length - stop, input.length - start);
};

;// ./node_modules/@smithy/util-endpoints/dist-es/lib/uriEncode.js
const uriEncode = (value) => encodeURIComponent(value).replace(/[!*'()]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/endpointFunctions.js

const endpointFunctions = {
    booleanEquals: booleanEquals,
    getAttr: getAttr,
    isSet: isSet,
    isValidHostLabel: isValidHostLabel/* isValidHostLabel */.X,
    not: not,
    parseURL: parseURL,
    stringEquals: stringEquals,
    substring: substring,
    uriEncode: uriEncode,
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/evaluateTemplate.js

const evaluateTemplate = (template, options) => {
    const evaluatedTemplateArr = [];
    const templateContext = {
        ...options.endpointParams,
        ...options.referenceRecord,
    };
    let currentIndex = 0;
    while (currentIndex < template.length) {
        const openingBraceIndex = template.indexOf("{", currentIndex);
        if (openingBraceIndex === -1) {
            evaluatedTemplateArr.push(template.slice(currentIndex));
            break;
        }
        evaluatedTemplateArr.push(template.slice(currentIndex, openingBraceIndex));
        const closingBraceIndex = template.indexOf("}", openingBraceIndex);
        if (closingBraceIndex === -1) {
            evaluatedTemplateArr.push(template.slice(openingBraceIndex));
            break;
        }
        if (template[openingBraceIndex + 1] === "{" && template[closingBraceIndex + 1] === "}") {
            evaluatedTemplateArr.push(template.slice(openingBraceIndex + 1, closingBraceIndex));
            currentIndex = closingBraceIndex + 2;
        }
        const parameterName = template.substring(openingBraceIndex + 1, closingBraceIndex);
        if (parameterName.includes("#")) {
            const [refName, attrName] = parameterName.split("#");
            evaluatedTemplateArr.push(getAttr(templateContext[refName], attrName));
        }
        else {
            evaluatedTemplateArr.push(templateContext[parameterName]);
        }
        currentIndex = closingBraceIndex + 1;
    }
    return evaluatedTemplateArr.join("");
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/getReferenceValue.js
const getReferenceValue = ({ ref }, options) => {
    const referenceRecord = {
        ...options.endpointParams,
        ...options.referenceRecord,
    };
    return referenceRecord[ref];
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/evaluateExpression.js




const evaluateExpression = (obj, keyName, options) => {
    if (typeof obj === "string") {
        return evaluateTemplate(obj, options);
    }
    else if (obj["fn"]) {
        return callFunction(obj, options);
    }
    else if (obj["ref"]) {
        return getReferenceValue(obj, options);
    }
    throw new EndpointError(`'${keyName}': ${String(obj)} is not a string, function or reference.`);
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/callFunction.js



const callFunction = ({ fn, argv }, options) => {
    const evaluatedArgs = argv.map((arg) => ["boolean", "number"].includes(typeof arg) ? arg : evaluateExpression(arg, "arg", options));
    const fnSegments = fn.split(".");
    if (fnSegments[0] in customEndpointFunctions/* customEndpointFunctions */.m && fnSegments[1] != null) {
        return customEndpointFunctions/* customEndpointFunctions */.m[fnSegments[0]][fnSegments[1]](...evaluatedArgs);
    }
    return endpointFunctions[fn](...evaluatedArgs);
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/evaluateCondition.js



const evaluateCondition = ({ assign, ...fnArgs }, options) => {
    if (assign && assign in options.referenceRecord) {
        throw new EndpointError(`'${assign}' is already defined in Reference Record.`);
    }
    const value = callFunction(fnArgs, options);
    options.logger?.debug?.(`${debugId} evaluateCondition: ${toDebugString(fnArgs)} = ${toDebugString(value)}`);
    return {
        result: value === "" ? true : !!value,
        ...(assign != null && { toAssign: { name: assign, value } }),
    };
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/evaluateConditions.js


const evaluateConditions = (conditions = [], options) => {
    const conditionsReferenceRecord = {};
    for (const condition of conditions) {
        const { result, toAssign } = evaluateCondition(condition, {
            ...options,
            referenceRecord: {
                ...options.referenceRecord,
                ...conditionsReferenceRecord,
            },
        });
        if (!result) {
            return { result };
        }
        if (toAssign) {
            conditionsReferenceRecord[toAssign.name] = toAssign.value;
            options.logger?.debug?.(`${debugId} assign: ${toAssign.name} := ${toDebugString(toAssign.value)}`);
        }
    }
    return { result: true, referenceRecord: conditionsReferenceRecord };
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointHeaders.js


const getEndpointHeaders = (headers, options) => Object.entries(headers).reduce((acc, [headerKey, headerVal]) => ({
    ...acc,
    [headerKey]: headerVal.map((headerValEntry) => {
        const processedExpr = evaluateExpression(headerValEntry, "Header value entry", options);
        if (typeof processedExpr !== "string") {
            throw new EndpointError(`Header '${headerKey}' value '${processedExpr}' is not a string`);
        }
        return processedExpr;
    }),
}), {});

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointProperty.js



const getEndpointProperty = (property, options) => {
    if (Array.isArray(property)) {
        return property.map((propertyEntry) => getEndpointProperty(propertyEntry, options));
    }
    switch (typeof property) {
        case "string":
            return evaluateTemplate(property, options);
        case "object":
            if (property === null) {
                throw new EndpointError(`Unexpected endpoint property: ${property}`);
            }
            return getEndpointProperties(property, options);
        case "boolean":
            return property;
        default:
            throw new EndpointError(`Unexpected endpoint property type: ${typeof property}`);
    }
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointProperties.js

const getEndpointProperties = (properties, options) => Object.entries(properties).reduce((acc, [propertyKey, propertyVal]) => ({
    ...acc,
    [propertyKey]: getEndpointProperty(propertyVal, options),
}), {});

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/getEndpointUrl.js


const getEndpointUrl = (endpointUrl, options) => {
    const expression = evaluateExpression(endpointUrl, "Endpoint URL", options);
    if (typeof expression === "string") {
        try {
            return new URL(expression);
        }
        catch (error) {
            console.error(`Failed to construct URL with ${expression}`, error);
            throw error;
        }
    }
    throw new EndpointError(`Endpoint URL must be a string, got ${typeof expression}`);
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/evaluateEndpointRule.js





const evaluateEndpointRule = (endpointRule, options) => {
    const { conditions, endpoint } = endpointRule;
    const { result, referenceRecord } = evaluateConditions(conditions, options);
    if (!result) {
        return;
    }
    const endpointRuleOptions = {
        ...options,
        referenceRecord: { ...options.referenceRecord, ...referenceRecord },
    };
    const { url, properties, headers } = endpoint;
    options.logger?.debug?.(`${debugId} Resolving endpoint from template: ${toDebugString(endpoint)}`);
    return {
        ...(headers != undefined && {
            headers: getEndpointHeaders(headers, endpointRuleOptions),
        }),
        ...(properties != undefined && {
            properties: getEndpointProperties(properties, endpointRuleOptions),
        }),
        url: getEndpointUrl(url, endpointRuleOptions),
    };
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/evaluateErrorRule.js



const evaluateErrorRule = (errorRule, options) => {
    const { conditions, error } = errorRule;
    const { result, referenceRecord } = evaluateConditions(conditions, options);
    if (!result) {
        return;
    }
    throw new EndpointError(evaluateExpression(error, "Error", {
        ...options,
        referenceRecord: { ...options.referenceRecord, ...referenceRecord },
    }));
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/evaluateTreeRule.js


const evaluateTreeRule = (treeRule, options) => {
    const { conditions, rules } = treeRule;
    const { result, referenceRecord } = evaluateConditions(conditions, options);
    if (!result) {
        return;
    }
    return evaluateRules(rules, {
        ...options,
        referenceRecord: { ...options.referenceRecord, ...referenceRecord },
    });
};

;// ./node_modules/@smithy/util-endpoints/dist-es/utils/evaluateRules.js




const evaluateRules = (rules, options) => {
    for (const rule of rules) {
        if (rule.type === "endpoint") {
            const endpointOrUndefined = evaluateEndpointRule(rule, options);
            if (endpointOrUndefined) {
                return endpointOrUndefined;
            }
        }
        else if (rule.type === "error") {
            evaluateErrorRule(rule, options);
        }
        else if (rule.type === "tree") {
            const endpointOrUndefined = evaluateTreeRule(rule, options);
            if (endpointOrUndefined) {
                return endpointOrUndefined;
            }
        }
        else {
            throw new EndpointError(`Unknown endpoint rule: ${rule}`);
        }
    }
    throw new EndpointError(`Rules evaluation failed`);
};

;// ./node_modules/@smithy/util-endpoints/dist-es/resolveEndpoint.js



const resolveEndpoint = (ruleSetObject, options) => {
    const { endpointParams, logger } = options;
    const { parameters, rules } = ruleSetObject;
    options.logger?.debug?.(`${debugId} Initial EndpointParams: ${toDebugString(endpointParams)}`);
    const paramsWithDefault = Object.entries(parameters)
        .filter(([, v]) => v.default != null)
        .map(([k, v]) => [k, v.default]);
    if (paramsWithDefault.length > 0) {
        for (const [paramKey, paramDefaultValue] of paramsWithDefault) {
            endpointParams[paramKey] = endpointParams[paramKey] ?? paramDefaultValue;
        }
    }
    const requiredParams = Object.entries(parameters)
        .filter(([, v]) => v.required)
        .map(([k]) => k);
    for (const requiredParam of requiredParams) {
        if (endpointParams[requiredParam] == null) {
            throw new EndpointError(`Missing required parameter: '${requiredParam}'`);
        }
    }
    const endpoint = evaluateRules(rules, { endpointParams, logger, referenceRecord: {} });
    options.logger?.debug?.(`${debugId} Resolved endpoint: ${toDebugString(endpoint)}`);
    return endpoint;
};


/***/ }),

/***/ 7267:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   V: () => (/* binding */ SMITHY_CONTEXT_KEY)
/* harmony export */ });
const SMITHY_CONTEXT_KEY = "__smithy_context";


/***/ }),

/***/ 7287:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ resolveUserAgentConfig),
/* harmony export */   b: () => (/* binding */ DEFAULT_UA_APP_ID)
/* harmony export */ });
/* harmony import */ var _smithy_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4367);

const DEFAULT_UA_APP_ID = undefined;
function isValidUserAgentAppId(appId) {
    if (appId === undefined) {
        return true;
    }
    return typeof appId === "string" && appId.length <= 50;
}
function resolveUserAgentConfig(input) {
    const normalizedAppIdProvider = (0,_smithy_core__WEBPACK_IMPORTED_MODULE_0__/* .normalizeProvider */ .t)(input.userAgentAppId ?? DEFAULT_UA_APP_ID);
    const { customUserAgent } = input;
    return Object.assign(input, {
        customUserAgent: typeof customUserAgent === "string" ? [[customUserAgent]] : customUserAgent,
        userAgentAppId: async () => {
            const appId = await normalizedAppIdProvider();
            if (!isValidUserAgentAppId(appId)) {
                const logger = input.logger?.constructor?.name === "NoOpLogger" || !input.logger ? console : input.logger;
                if (typeof appId !== "string") {
                    logger?.warn("userAgentAppId must be a string or undefined.");
                }
                else if (appId.length > 50) {
                    logger?.warn("The provided userAgentAppId exceeds the maximum length of 50 characters.");
                }
            }
            return appId;
        },
    });
}


/***/ }),

/***/ 7324:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K: () => (/* binding */ HttpRequest)
/* harmony export */ });
class HttpRequest {
    constructor(options) {
        this.method = options.method || "GET";
        this.hostname = options.hostname || "localhost";
        this.port = options.port;
        this.query = options.query || {};
        this.headers = options.headers || {};
        this.body = options.body;
        this.protocol = options.protocol
            ? options.protocol.slice(-1) !== ":"
                ? `${options.protocol}:`
                : options.protocol
            : "https:";
        this.path = options.path ? (options.path.charAt(0) !== "/" ? `/${options.path}` : options.path) : "/";
        this.username = options.username;
        this.password = options.password;
        this.fragment = options.fragment;
    }
    static clone(request) {
        const cloned = new HttpRequest({
            ...request,
            headers: { ...request.headers },
        });
        if (cloned.query) {
            cloned.query = cloneQuery(cloned.query);
        }
        return cloned;
    }
    static isInstance(request) {
        if (!request) {
            return false;
        }
        const req = request;
        return ("method" in req &&
            "protocol" in req &&
            "hostname" in req &&
            "path" in req &&
            typeof req["query"] === "object" &&
            typeof req["headers"] === "object");
    }
    clone() {
        return HttpRequest.clone(this);
    }
}
function cloneQuery(query) {
    return Object.keys(query).reduce((carry, paramName) => {
        const param = query[paramName];
        return {
            ...carry,
            [paramName]: Array.isArray(param) ? [...param] : param,
        };
    }, {});
}


/***/ }),

/***/ 7355:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gz: () => (/* binding */ DEFAULT_MAX_ATTEMPTS),
/* harmony export */   L0: () => (/* binding */ DEFAULT_RETRY_MODE),
/* harmony export */   cm: () => (/* binding */ RETRY_MODES)
/* harmony export */ });
var RETRY_MODES;
(function (RETRY_MODES) {
    RETRY_MODES["STANDARD"] = "standard";
    RETRY_MODES["ADAPTIVE"] = "adaptive";
})(RETRY_MODES || (RETRY_MODES = {}));
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;


/***/ }),

/***/ 7459:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ fromUtf8)
/* harmony export */ });
/* harmony import */ var _smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6909);

const fromUtf8 = (input) => {
    const buf = (0,_smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__/* .fromString */ .s)(input, "utf8");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};


/***/ }),

/***/ 7461:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ EndpointCache)
/* harmony export */ });
class EndpointCache {
    constructor({ size, params }) {
        this.data = new Map();
        this.parameters = [];
        this.capacity = size ?? 50;
        if (params) {
            this.parameters = params;
        }
    }
    get(endpointParams, resolver) {
        const key = this.hash(endpointParams);
        if (key === false) {
            return resolver();
        }
        if (!this.data.has(key)) {
            if (this.data.size > this.capacity + 10) {
                const keys = this.data.keys();
                let i = 0;
                while (true) {
                    const { value, done } = keys.next();
                    this.data.delete(value);
                    if (done || ++i > 10) {
                        break;
                    }
                }
            }
            this.data.set(key, resolver());
        }
        return this.data.get(key);
    }
    size() {
        return this.data.size;
    }
    hash(endpointParams) {
        let buffer = "";
        const { parameters } = this;
        if (parameters.length === 0) {
            return false;
        }
        for (const param of parameters) {
            const val = String(endpointParams[param] ?? "");
            if (val.includes("|;")) {
                return false;
            }
            buffer += val + "|;";
        }
        return buffer;
    }
}


/***/ }),

/***/ 7638:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ toUtf8)
/* harmony export */ });
/* harmony import */ var _smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6909);

const toUtf8 = (input) => {
    if (typeof input === "string") {
        return input;
    }
    if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
        throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
    }
    return (0,_smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__/* .fromArrayBuffer */ .Q)(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
};


/***/ }),

/***/ 7813:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y7: () => (/* binding */ getLoggerPlugin)
/* harmony export */ });
/* unused harmony exports loggerMiddleware, loggerMiddlewareOptions */
const loggerMiddleware = () => (next, context) => async (args) => {
    try {
        const response = await next(args);
        const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
        const { overrideInputFilterSensitiveLog, overrideOutputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
        const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
        const outputFilterSensitiveLog = overrideOutputFilterSensitiveLog ?? context.outputFilterSensitiveLog;
        const { $metadata, ...outputWithoutMetadata } = response.output;
        logger?.info?.({
            clientName,
            commandName,
            input: inputFilterSensitiveLog(args.input),
            output: outputFilterSensitiveLog(outputWithoutMetadata),
            metadata: $metadata,
        });
        return response;
    }
    catch (error) {
        const { clientName, commandName, logger, dynamoDbDocumentClientOptions = {} } = context;
        const { overrideInputFilterSensitiveLog } = dynamoDbDocumentClientOptions;
        const inputFilterSensitiveLog = overrideInputFilterSensitiveLog ?? context.inputFilterSensitiveLog;
        logger?.error?.({
            clientName,
            commandName,
            input: inputFilterSensitiveLog(args.input),
            error,
            metadata: error.$metadata,
        });
        throw error;
    }
};
const loggerMiddlewareOptions = {
    name: "loggerMiddleware",
    tags: ["LOGGER"],
    step: "initialize",
    override: true,
};
const getLoggerPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(loggerMiddleware(), loggerMiddlewareOptions);
    },
});


/***/ }),

/***/ 7821:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K: () => (/* binding */ Client)
/* harmony export */ });
/* harmony import */ var _smithy_middleware_stack__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1671);

class Client {
    constructor(config) {
        this.config = config;
        this.middlewareStack = (0,_smithy_middleware_stack__WEBPACK_IMPORTED_MODULE_0__/* .constructStack */ .o)();
    }
    send(command, optionsOrCb, cb) {
        const options = typeof optionsOrCb !== "function" ? optionsOrCb : undefined;
        const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
        const useHandlerCache = options === undefined && this.config.cacheMiddleware === true;
        let handler;
        if (useHandlerCache) {
            if (!this.handlers) {
                this.handlers = new WeakMap();
            }
            const handlers = this.handlers;
            if (handlers.has(command.constructor)) {
                handler = handlers.get(command.constructor);
            }
            else {
                handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
                handlers.set(command.constructor, handler);
            }
        }
        else {
            delete this.handlers;
            handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
        }
        if (callback) {
            handler(command)
                .then((result) => callback(null, result.output), (err) => callback(err))
                .catch(() => { });
        }
        else {
            return handler(command).then((result) => result.output);
        }
    }
    destroy() {
        this.config?.requestHandler?.destroy?.();
        delete this.handlers;
    }
}


/***/ }),

/***/ 7916:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ extendedEncodeURIComponent)
/* harmony export */ });
function extendedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}


/***/ }),

/***/ 7966:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  n: () => (/* binding */ getRecursionDetectionPlugin)
});

;// ./node_modules/@aws-sdk/middleware-recursion-detection/dist-es/configuration.js
const recursionDetectionMiddlewareOptions = {
    step: "build",
    tags: ["RECURSION_DETECTION"],
    name: "recursionDetectionMiddleware",
    override: true,
    priority: "low",
};

// EXTERNAL MODULE: ./node_modules/@aws/lambda-invoke-store/dist/invoke-store.js
var invoke_store = __webpack_require__(1724);
// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var httpRequest = __webpack_require__(7324);
;// ./node_modules/@aws-sdk/middleware-recursion-detection/dist-es/recursionDetectionMiddleware.js


const TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id";
const ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME";
const ENV_TRACE_ID = "_X_AMZN_TRACE_ID";
const recursionDetectionMiddleware = () => (next) => async (args) => {
    const { request } = args;
    if (!httpRequest/* HttpRequest */.K.isInstance(request)) {
        return next(args);
    }
    const traceIdHeader = Object.keys(request.headers ?? {}).find((h) => h.toLowerCase() === TRACE_ID_HEADER_NAME.toLowerCase()) ??
        TRACE_ID_HEADER_NAME;
    if (request.headers.hasOwnProperty(traceIdHeader)) {
        return next(args);
    }
    const functionName = process.env[ENV_LAMBDA_FUNCTION_NAME];
    const traceIdFromEnv = process.env[ENV_TRACE_ID];
    const traceIdFromInvokeStore = invoke_store/* InvokeStore */.A.getXRayTraceId();
    const traceId = traceIdFromInvokeStore ?? traceIdFromEnv;
    const nonEmptyString = (str) => typeof str === "string" && str.length > 0;
    if (nonEmptyString(functionName) && nonEmptyString(traceId)) {
        request.headers[TRACE_ID_HEADER_NAME] = traceId;
    }
    return next({
        ...args,
        request,
    });
};

;// ./node_modules/@aws-sdk/middleware-recursion-detection/dist-es/getRecursionDetectionPlugin.js


const getRecursionDetectionPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(recursionDetectionMiddleware(), recursionDetectionMiddlewareOptions);
    },
});


/***/ }),

/***/ 7973:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  h: () => (/* binding */ resolveAwsSdkSigV4Config)
});

// UNUSED EXPORTS: resolveAWSSDKSigV4Config

// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
var setCredentialFeature = __webpack_require__(244);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/normalizeProvider.js
var normalizeProvider = __webpack_require__(4367);
;// ./node_modules/@smithy/core/dist-es/util-identity-and-auth/memoizeIdentityProvider.js
const createIsIdentityExpiredFunction = (expirationMs) => (identity) => doesIdentityRequireRefresh(identity) && identity.expiration.getTime() - Date.now() < expirationMs;
const EXPIRATION_MS = 300000;
const isIdentityExpired = createIsIdentityExpiredFunction(EXPIRATION_MS);
const doesIdentityRequireRefresh = (identity) => identity.expiration !== undefined;
const memoizeIdentityProvider = (provider, isExpired, requiresRefresh) => {
    if (provider === undefined) {
        return undefined;
    }
    const normalizedProvider = typeof provider !== "function" ? async () => Promise.resolve(provider) : provider;
    let resolved;
    let pending;
    let hasResult;
    let isConstant = false;
    const coalesceProvider = async (options) => {
        if (!pending) {
            pending = normalizedProvider(options);
        }
        try {
            resolved = await pending;
            hasResult = true;
            isConstant = false;
        }
        finally {
            pending = undefined;
        }
        return resolved;
    };
    if (isExpired === undefined) {
        return async (options) => {
            if (!hasResult || options?.forceRefresh) {
                resolved = await coalesceProvider(options);
            }
            return resolved;
        };
    }
    return async (options) => {
        if (!hasResult || options?.forceRefresh) {
            resolved = await coalesceProvider(options);
        }
        if (isConstant) {
            return resolved;
        }
        if (!requiresRefresh(resolved)) {
            isConstant = true;
            return resolved;
        }
        if (isExpired(resolved)) {
            await coalesceProvider(options);
            return resolved;
        }
        return resolved;
    };
};

// EXTERNAL MODULE: ./node_modules/@smithy/util-hex-encoding/dist-es/index.js
var dist_es = __webpack_require__(8004);
// EXTERNAL MODULE: ./node_modules/@smithy/util-utf8/dist-es/toUint8Array.js
var toUint8Array = __webpack_require__(4424);
;// ./node_modules/@smithy/signature-v4/dist-es/constants.js
const ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
const CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
const AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
const SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
const EXPIRES_QUERY_PARAM = "X-Amz-Expires";
const SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
const TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
const REGION_SET_PARAM = "X-Amz-Region-Set";
const AUTH_HEADER = "authorization";
const AMZ_DATE_HEADER = AMZ_DATE_QUERY_PARAM.toLowerCase();
const DATE_HEADER = "date";
const GENERATED_HEADERS = [AUTH_HEADER, AMZ_DATE_HEADER, DATE_HEADER];
const SIGNATURE_HEADER = SIGNATURE_QUERY_PARAM.toLowerCase();
const SHA256_HEADER = "x-amz-content-sha256";
const TOKEN_HEADER = TOKEN_QUERY_PARAM.toLowerCase();
const HOST_HEADER = "host";
const ALWAYS_UNSIGNABLE_HEADERS = {
    authorization: true,
    "cache-control": true,
    connection: true,
    expect: true,
    from: true,
    "keep-alive": true,
    "max-forwards": true,
    pragma: true,
    referer: true,
    te: true,
    trailer: true,
    "transfer-encoding": true,
    upgrade: true,
    "user-agent": true,
    "x-amzn-trace-id": true,
};
const PROXY_HEADER_PATTERN = /^proxy-/;
const SEC_HEADER_PATTERN = /^sec-/;
const UNSIGNABLE_PATTERNS = (/* unused pure expression or super */ null && ([/^proxy-/i, /^sec-/i]));
const ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
const ALGORITHM_IDENTIFIER_V4A = "AWS4-ECDSA-P256-SHA256";
const EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
const UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
const MAX_CACHE_SIZE = 50;
const KEY_TYPE_IDENTIFIER = "aws4_request";
const MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;

;// ./node_modules/@smithy/signature-v4/dist-es/credentialDerivation.js



const signingKeyCache = {};
const cacheQueue = [];
const createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${KEY_TYPE_IDENTIFIER}`;
const getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
    const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
    const cacheKey = `${shortDate}:${region}:${service}:${(0,dist_es/* toHex */.n)(credsHash)}:${credentials.sessionToken}`;
    if (cacheKey in signingKeyCache) {
        return signingKeyCache[cacheKey];
    }
    cacheQueue.push(cacheKey);
    while (cacheQueue.length > MAX_CACHE_SIZE) {
        delete signingKeyCache[cacheQueue.shift()];
    }
    let key = `AWS4${credentials.secretAccessKey}`;
    for (const signable of [shortDate, region, service, KEY_TYPE_IDENTIFIER]) {
        key = await hmac(sha256Constructor, key, signable);
    }
    return (signingKeyCache[cacheKey] = key);
};
const clearCredentialCache = () => {
    cacheQueue.length = 0;
    Object.keys(signingKeyCache).forEach((cacheKey) => {
        delete signingKeyCache[cacheKey];
    });
};
const hmac = (ctor, secret, data) => {
    const hash = new ctor(secret);
    hash.update((0,toUint8Array/* toUint8Array */.F)(data));
    return hash.digest();
};

;// ./node_modules/@smithy/signature-v4/dist-es/getCanonicalHeaders.js

const getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
    const canonical = {};
    for (const headerName of Object.keys(headers).sort()) {
        if (headers[headerName] == undefined) {
            continue;
        }
        const canonicalHeaderName = headerName.toLowerCase();
        if (canonicalHeaderName in ALWAYS_UNSIGNABLE_HEADERS ||
            unsignableHeaders?.has(canonicalHeaderName) ||
            PROXY_HEADER_PATTERN.test(canonicalHeaderName) ||
            SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
            if (!signableHeaders || (signableHeaders && !signableHeaders.has(canonicalHeaderName))) {
                continue;
            }
        }
        canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
    }
    return canonical;
};

// EXTERNAL MODULE: ./node_modules/@smithy/is-array-buffer/dist-es/index.js
var is_array_buffer_dist_es = __webpack_require__(3695);
;// ./node_modules/@smithy/signature-v4/dist-es/getPayloadHash.js




const getPayloadHash = async ({ headers, body }, hashConstructor) => {
    for (const headerName of Object.keys(headers)) {
        if (headerName.toLowerCase() === SHA256_HEADER) {
            return headers[headerName];
        }
    }
    if (body == undefined) {
        return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    }
    else if (typeof body === "string" || ArrayBuffer.isView(body) || (0,is_array_buffer_dist_es/* isArrayBuffer */.m)(body)) {
        const hashCtor = new hashConstructor();
        hashCtor.update((0,toUint8Array/* toUint8Array */.F)(body));
        return (0,dist_es/* toHex */.n)(await hashCtor.digest());
    }
    return UNSIGNED_PAYLOAD;
};

// EXTERNAL MODULE: ./node_modules/@smithy/util-utf8/dist-es/fromUtf8.js
var fromUtf8 = __webpack_require__(7459);
;// ./node_modules/@smithy/signature-v4/dist-es/HeaderFormatter.js


class HeaderFormatter {
    format(headers) {
        const chunks = [];
        for (const headerName of Object.keys(headers)) {
            const bytes = (0,fromUtf8/* fromUtf8 */.a)(headerName);
            chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
        }
        const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
        let position = 0;
        for (const chunk of chunks) {
            out.set(chunk, position);
            position += chunk.byteLength;
        }
        return out;
    }
    formatHeaderValue(header) {
        switch (header.type) {
            case "boolean":
                return Uint8Array.from([header.value ? 0 : 1]);
            case "byte":
                return Uint8Array.from([2, header.value]);
            case "short":
                const shortView = new DataView(new ArrayBuffer(3));
                shortView.setUint8(0, 3);
                shortView.setInt16(1, header.value, false);
                return new Uint8Array(shortView.buffer);
            case "integer":
                const intView = new DataView(new ArrayBuffer(5));
                intView.setUint8(0, 4);
                intView.setInt32(1, header.value, false);
                return new Uint8Array(intView.buffer);
            case "long":
                const longBytes = new Uint8Array(9);
                longBytes[0] = 5;
                longBytes.set(header.value.bytes, 1);
                return longBytes;
            case "binary":
                const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
                binView.setUint8(0, 6);
                binView.setUint16(1, header.value.byteLength, false);
                const binBytes = new Uint8Array(binView.buffer);
                binBytes.set(header.value, 3);
                return binBytes;
            case "string":
                const utf8Bytes = (0,fromUtf8/* fromUtf8 */.a)(header.value);
                const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
                strView.setUint8(0, 7);
                strView.setUint16(1, utf8Bytes.byteLength, false);
                const strBytes = new Uint8Array(strView.buffer);
                strBytes.set(utf8Bytes, 3);
                return strBytes;
            case "timestamp":
                const tsBytes = new Uint8Array(9);
                tsBytes[0] = 8;
                tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
                return tsBytes;
            case "uuid":
                if (!UUID_PATTERN.test(header.value)) {
                    throw new Error(`Invalid UUID received: ${header.value}`);
                }
                const uuidBytes = new Uint8Array(17);
                uuidBytes[0] = 9;
                uuidBytes.set((0,dist_es/* fromHex */.a)(header.value.replace(/\-/g, "")), 1);
                return uuidBytes;
        }
    }
}
var HEADER_VALUE_TYPE;
(function (HEADER_VALUE_TYPE) {
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolTrue"] = 0] = "boolTrue";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolFalse"] = 1] = "boolFalse";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byte"] = 2] = "byte";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["short"] = 3] = "short";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["integer"] = 4] = "integer";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["long"] = 5] = "long";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byteArray"] = 6] = "byteArray";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["string"] = 7] = "string";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["timestamp"] = 8] = "timestamp";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
class Int64 {
    constructor(bytes) {
        this.bytes = bytes;
        if (bytes.byteLength !== 8) {
            throw new Error("Int64 buffers must be exactly 8 bytes");
        }
    }
    static fromNumber(number) {
        if (number > 9223372036854776000 || number < -9223372036854776000) {
            throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
        }
        const bytes = new Uint8Array(8);
        for (let i = 7, remaining = Math.abs(Math.round(number)); i > -1 && remaining > 0; i--, remaining /= 256) {
            bytes[i] = remaining;
        }
        if (number < 0) {
            negate(bytes);
        }
        return new Int64(bytes);
    }
    valueOf() {
        const bytes = this.bytes.slice(0);
        const negative = bytes[0] & 0b10000000;
        if (negative) {
            negate(bytes);
        }
        return parseInt((0,dist_es/* toHex */.n)(bytes), 16) * (negative ? -1 : 1);
    }
    toString() {
        return String(this.valueOf());
    }
}
function negate(bytes) {
    for (let i = 0; i < 8; i++) {
        bytes[i] ^= 0xff;
    }
    for (let i = 7; i > -1; i--) {
        bytes[i]++;
        if (bytes[i] !== 0)
            break;
    }
}

;// ./node_modules/@smithy/signature-v4/dist-es/headerUtil.js
const hasHeader = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
            return true;
        }
    }
    return false;
};
const getHeaderValue = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
            return headers[headerName];
        }
    }
    return undefined;
};
const deleteHeader = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
            delete headers[headerName];
        }
    }
};

// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var httpRequest = __webpack_require__(7324);
;// ./node_modules/@smithy/signature-v4/dist-es/moveHeadersToQuery.js

const moveHeadersToQuery = (request, options = {}) => {
    const { headers, query = {} } = httpRequest/* HttpRequest */.K.clone(request);
    for (const name of Object.keys(headers)) {
        const lname = name.toLowerCase();
        if ((lname.slice(0, 6) === "x-amz-" && !options.unhoistableHeaders?.has(lname)) ||
            options.hoistableHeaders?.has(lname)) {
            query[name] = headers[name];
            delete headers[name];
        }
    }
    return {
        ...request,
        headers,
        query,
    };
};

;// ./node_modules/@smithy/signature-v4/dist-es/prepareRequest.js


const prepareRequest = (request) => {
    request = httpRequest/* HttpRequest */.K.clone(request);
    for (const headerName of Object.keys(request.headers)) {
        if (GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
            delete request.headers[headerName];
        }
    }
    return request;
};

// EXTERNAL MODULE: ./node_modules/@smithy/util-middleware/dist-es/normalizeProvider.js
var dist_es_normalizeProvider = __webpack_require__(8947);
// EXTERNAL MODULE: ./node_modules/@smithy/util-uri-escape/dist-es/escape-uri.js
var escape_uri = __webpack_require__(2531);
;// ./node_modules/@smithy/signature-v4/dist-es/getCanonicalQuery.js


const getCanonicalQuery = ({ query = {} }) => {
    const keys = [];
    const serialized = {};
    for (const key of Object.keys(query)) {
        if (key.toLowerCase() === SIGNATURE_HEADER) {
            continue;
        }
        const encodedKey = (0,escape_uri/* escapeUri */.o)(key);
        keys.push(encodedKey);
        const value = query[key];
        if (typeof value === "string") {
            serialized[encodedKey] = `${encodedKey}=${(0,escape_uri/* escapeUri */.o)(value)}`;
        }
        else if (Array.isArray(value)) {
            serialized[encodedKey] = value
                .slice(0)
                .reduce((encoded, value) => encoded.concat([`${encodedKey}=${(0,escape_uri/* escapeUri */.o)(value)}`]), [])
                .sort()
                .join("&");
        }
    }
    return keys
        .sort()
        .map((key) => serialized[key])
        .filter((serialized) => serialized)
        .join("&");
};

;// ./node_modules/@smithy/signature-v4/dist-es/utilDate.js
const iso8601 = (time) => toDate(time)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");
const toDate = (time) => {
    if (typeof time === "number") {
        return new Date(time * 1000);
    }
    if (typeof time === "string") {
        if (Number(time)) {
            return new Date(Number(time) * 1000);
        }
        return new Date(time);
    }
    return time;
};

;// ./node_modules/@smithy/signature-v4/dist-es/SignatureV4Base.js






class SignatureV4Base {
    constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true, }) {
        this.service = service;
        this.sha256 = sha256;
        this.uriEscapePath = uriEscapePath;
        this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
        this.regionProvider = (0,dist_es_normalizeProvider/* normalizeProvider */.t)(region);
        this.credentialProvider = (0,dist_es_normalizeProvider/* normalizeProvider */.t)(credentials);
    }
    createCanonicalRequest(request, canonicalHeaders, payloadHash) {
        const sortedHeaders = Object.keys(canonicalHeaders).sort();
        return `${request.method}
${this.getCanonicalPath(request)}
${getCanonicalQuery(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
    }
    async createStringToSign(longDate, credentialScope, canonicalRequest, algorithmIdentifier) {
        const hash = new this.sha256();
        hash.update((0,toUint8Array/* toUint8Array */.F)(canonicalRequest));
        const hashedRequest = await hash.digest();
        return `${algorithmIdentifier}
${longDate}
${credentialScope}
${(0,dist_es/* toHex */.n)(hashedRequest)}`;
    }
    getCanonicalPath({ path }) {
        if (this.uriEscapePath) {
            const normalizedPathSegments = [];
            for (const pathSegment of path.split("/")) {
                if (pathSegment?.length === 0)
                    continue;
                if (pathSegment === ".")
                    continue;
                if (pathSegment === "..") {
                    normalizedPathSegments.pop();
                }
                else {
                    normalizedPathSegments.push(pathSegment);
                }
            }
            const normalizedPath = `${path?.startsWith("/") ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && path?.endsWith("/") ? "/" : ""}`;
            const doubleEncoded = (0,escape_uri/* escapeUri */.o)(normalizedPath);
            return doubleEncoded.replace(/%2F/g, "/");
        }
        return path;
    }
    validateResolvedCredentials(credentials) {
        if (typeof credentials !== "object" ||
            typeof credentials.accessKeyId !== "string" ||
            typeof credentials.secretAccessKey !== "string") {
            throw new Error("Resolved credential object is not valid");
        }
    }
    formatDate(now) {
        const longDate = iso8601(now).replace(/[\-:]/g, "");
        return {
            longDate,
            shortDate: longDate.slice(0, 8),
        };
    }
    getCanonicalHeaderList(headers) {
        return Object.keys(headers).sort().join(";");
    }
}

;// ./node_modules/@smithy/signature-v4/dist-es/SignatureV4.js











class SignatureV4 extends SignatureV4Base {
    constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true, }) {
        super({
            applyChecksum,
            credentials,
            region,
            service,
            sha256,
            uriEscapePath,
        });
        this.headerFormatter = new HeaderFormatter();
    }
    async presign(originalRequest, options = {}) {
        const { signingDate = new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, hoistableHeaders, signingRegion, signingService, } = options;
        const credentials = await this.credentialProvider();
        this.validateResolvedCredentials(credentials);
        const region = signingRegion ?? (await this.regionProvider());
        const { longDate, shortDate } = this.formatDate(signingDate);
        if (expiresIn > MAX_PRESIGNED_TTL) {
            return Promise.reject("Signature version 4 presigned URLs" + " must have an expiration date less than one week in" + " the future");
        }
        const scope = createScope(shortDate, region, signingService ?? this.service);
        const request = moveHeadersToQuery(prepareRequest(originalRequest), { unhoistableHeaders, hoistableHeaders });
        if (credentials.sessionToken) {
            request.query[TOKEN_QUERY_PARAM] = credentials.sessionToken;
        }
        request.query[ALGORITHM_QUERY_PARAM] = ALGORITHM_IDENTIFIER;
        request.query[CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
        request.query[AMZ_DATE_QUERY_PARAM] = longDate;
        request.query[EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
        const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
        request.query[SIGNED_HEADERS_QUERY_PARAM] = this.getCanonicalHeaderList(canonicalHeaders);
        request.query[SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, await getPayloadHash(originalRequest, this.sha256)));
        return request;
    }
    async sign(toSign, options) {
        if (typeof toSign === "string") {
            return this.signString(toSign, options);
        }
        else if (toSign.headers && toSign.payload) {
            return this.signEvent(toSign, options);
        }
        else if (toSign.message) {
            return this.signMessage(toSign, options);
        }
        else {
            return this.signRequest(toSign, options);
        }
    }
    async signEvent({ headers, payload }, { signingDate = new Date(), priorSignature, signingRegion, signingService }) {
        const region = signingRegion ?? (await this.regionProvider());
        const { shortDate, longDate } = this.formatDate(signingDate);
        const scope = createScope(shortDate, region, signingService ?? this.service);
        const hashedPayload = await getPayloadHash({ headers: {}, body: payload }, this.sha256);
        const hash = new this.sha256();
        hash.update(headers);
        const hashedHeaders = (0,dist_es/* toHex */.n)(await hash.digest());
        const stringToSign = [
            EVENT_ALGORITHM_IDENTIFIER,
            longDate,
            scope,
            priorSignature,
            hashedHeaders,
            hashedPayload,
        ].join("\n");
        return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
    }
    async signMessage(signableMessage, { signingDate = new Date(), signingRegion, signingService }) {
        const promise = this.signEvent({
            headers: this.headerFormatter.format(signableMessage.message.headers),
            payload: signableMessage.message.body,
        }, {
            signingDate,
            signingRegion,
            signingService,
            priorSignature: signableMessage.priorSignature,
        });
        return promise.then((signature) => {
            return { message: signableMessage.message, signature };
        });
    }
    async signString(stringToSign, { signingDate = new Date(), signingRegion, signingService } = {}) {
        const credentials = await this.credentialProvider();
        this.validateResolvedCredentials(credentials);
        const region = signingRegion ?? (await this.regionProvider());
        const { shortDate } = this.formatDate(signingDate);
        const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
        hash.update((0,toUint8Array/* toUint8Array */.F)(stringToSign));
        return (0,dist_es/* toHex */.n)(await hash.digest());
    }
    async signRequest(requestToSign, { signingDate = new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService, } = {}) {
        const credentials = await this.credentialProvider();
        this.validateResolvedCredentials(credentials);
        const region = signingRegion ?? (await this.regionProvider());
        const request = prepareRequest(requestToSign);
        const { longDate, shortDate } = this.formatDate(signingDate);
        const scope = createScope(shortDate, region, signingService ?? this.service);
        request.headers[AMZ_DATE_HEADER] = longDate;
        if (credentials.sessionToken) {
            request.headers[TOKEN_HEADER] = credentials.sessionToken;
        }
        const payloadHash = await getPayloadHash(request, this.sha256);
        if (!hasHeader(SHA256_HEADER, request.headers) && this.applyChecksum) {
            request.headers[SHA256_HEADER] = payloadHash;
        }
        const canonicalHeaders = getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
        const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
        request.headers[AUTH_HEADER] =
            `${ALGORITHM_IDENTIFIER} ` +
                `Credential=${credentials.accessKeyId}/${scope}, ` +
                `SignedHeaders=${this.getCanonicalHeaderList(canonicalHeaders)}, ` +
                `Signature=${signature}`;
        return request;
    }
    async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
        const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest, ALGORITHM_IDENTIFIER);
        const hash = new this.sha256(await keyPromise);
        hash.update((0,toUint8Array/* toUint8Array */.F)(stringToSign));
        return (0,dist_es/* toHex */.n)(await hash.digest());
    }
    getSigningKey(credentials, region, shortDate, service) {
        return getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
    }
}

;// ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4Config.js



const resolveAwsSdkSigV4Config = (config) => {
    let inputCredentials = config.credentials;
    let isUserSupplied = !!config.credentials;
    let resolvedCredentials = undefined;
    Object.defineProperty(config, "credentials", {
        set(credentials) {
            if (credentials && credentials !== inputCredentials && credentials !== resolvedCredentials) {
                isUserSupplied = true;
            }
            inputCredentials = credentials;
            const memoizedProvider = normalizeCredentialProvider(config, {
                credentials: inputCredentials,
                credentialDefaultProvider: config.credentialDefaultProvider,
            });
            const boundProvider = bindCallerConfig(config, memoizedProvider);
            if (isUserSupplied && !boundProvider.attributed) {
                resolvedCredentials = async (options) => boundProvider(options).then((creds) => (0,setCredentialFeature/* setCredentialFeature */.g)(creds, "CREDENTIALS_CODE", "e"));
                resolvedCredentials.memoized = boundProvider.memoized;
                resolvedCredentials.configBound = boundProvider.configBound;
                resolvedCredentials.attributed = true;
            }
            else {
                resolvedCredentials = boundProvider;
            }
        },
        get() {
            return resolvedCredentials;
        },
        enumerable: true,
        configurable: true,
    });
    config.credentials = inputCredentials;
    const { signingEscapePath = true, systemClockOffset = config.systemClockOffset || 0, sha256, } = config;
    let signer;
    if (config.signer) {
        signer = (0,normalizeProvider/* normalizeProvider */.t)(config.signer);
    }
    else if (config.regionInfoProvider) {
        signer = () => (0,normalizeProvider/* normalizeProvider */.t)(config.region)()
            .then(async (region) => [
            (await config.regionInfoProvider(region, {
                useFipsEndpoint: await config.useFipsEndpoint(),
                useDualstackEndpoint: await config.useDualstackEndpoint(),
            })) || {},
            region,
        ])
            .then(([regionInfo, region]) => {
            const { signingRegion, signingService } = regionInfo;
            config.signingRegion = config.signingRegion || signingRegion || region;
            config.signingName = config.signingName || signingService || config.serviceId;
            const params = {
                ...config,
                credentials: config.credentials,
                region: config.signingRegion,
                service: config.signingName,
                sha256,
                uriEscapePath: signingEscapePath,
            };
            const SignerCtor = config.signerConstructor || SignatureV4;
            return new SignerCtor(params);
        });
    }
    else {
        signer = async (authScheme) => {
            authScheme = Object.assign({}, {
                name: "sigv4",
                signingName: config.signingName || config.defaultSigningName,
                signingRegion: await (0,normalizeProvider/* normalizeProvider */.t)(config.region)(),
                properties: {},
            }, authScheme);
            const signingRegion = authScheme.signingRegion;
            const signingService = authScheme.signingName;
            config.signingRegion = config.signingRegion || signingRegion;
            config.signingName = config.signingName || signingService || config.serviceId;
            const params = {
                ...config,
                credentials: config.credentials,
                region: config.signingRegion,
                service: config.signingName,
                sha256,
                uriEscapePath: signingEscapePath,
            };
            const SignerCtor = config.signerConstructor || SignatureV4;
            return new SignerCtor(params);
        };
    }
    const resolvedConfig = Object.assign(config, {
        systemClockOffset,
        signingEscapePath,
        signer,
    });
    return resolvedConfig;
};
const resolveAWSSDKSigV4Config = (/* unused pure expression or super */ null && (resolveAwsSdkSigV4Config));
function normalizeCredentialProvider(config, { credentials, credentialDefaultProvider, }) {
    let credentialsProvider;
    if (credentials) {
        if (!credentials?.memoized) {
            credentialsProvider = memoizeIdentityProvider(credentials, isIdentityExpired, doesIdentityRequireRefresh);
        }
        else {
            credentialsProvider = credentials;
        }
    }
    else {
        if (credentialDefaultProvider) {
            credentialsProvider = (0,normalizeProvider/* normalizeProvider */.t)(credentialDefaultProvider(Object.assign({}, config, {
                parentClientConfig: config,
            })));
        }
        else {
            credentialsProvider = async () => {
                throw new Error("@aws-sdk/core::resolveAwsSdkSigV4Config - `credentials` not provided and no credentialDefaultProvider was configured.");
            };
        }
    }
    credentialsProvider.memoized = true;
    return credentialsProvider;
}
function bindCallerConfig(config, credentialsProvider) {
    if (credentialsProvider.configBound) {
        return credentialsProvider;
    }
    const fn = async (options) => credentialsProvider({ ...options, callerClientConfig: config });
    fn.memoized = credentialsProvider.memoized;
    fn.configBound = true;
    return fn;
}


/***/ }),

/***/ 8004:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ fromHex),
/* harmony export */   n: () => (/* binding */ toHex)
/* harmony export */ });
const SHORT_TO_HEX = {};
const HEX_TO_SHORT = {};
for (let i = 0; i < 256; i++) {
    let encodedByte = i.toString(16).toLowerCase();
    if (encodedByte.length === 1) {
        encodedByte = `0${encodedByte}`;
    }
    SHORT_TO_HEX[i] = encodedByte;
    HEX_TO_SHORT[encodedByte] = i;
}
function fromHex(encoded) {
    if (encoded.length % 2 !== 0) {
        throw new Error("Hex encoded strings must have an even number length");
    }
    const out = new Uint8Array(encoded.length / 2);
    for (let i = 0; i < encoded.length; i += 2) {
        const encodedByte = encoded.slice(i, i + 2).toLowerCase();
        if (encodedByte in HEX_TO_SHORT) {
            out[i / 2] = HEX_TO_SHORT[encodedByte];
        }
        else {
            throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
        }
    }
    return out;
}
function toHex(bytes) {
    let out = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        out += SHORT_TO_HEX[bytes[i]];
    }
    return out;
}


/***/ }),

/***/ 8059:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  sM: () => (/* binding */ getUserAgentPlugin)
});

// UNUSED EXPORTS: getUserAgentMiddlewareOptions, userAgentMiddleware

// EXTERNAL MODULE: ./node_modules/@aws-sdk/util-endpoints/dist-es/index.js + 15 modules
var dist_es = __webpack_require__(643);
// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var httpRequest = __webpack_require__(7324);
;// ./node_modules/@aws-sdk/core/dist-es/submodules/client/setFeature.js
function setFeature(context, feature, value) {
    if (!context.__aws_sdk_context) {
        context.__aws_sdk_context = {
            features: {},
        };
    }
    else if (!context.__aws_sdk_context.features) {
        context.__aws_sdk_context.features = {};
    }
    context.__aws_sdk_context.features[feature] = value;
}

;// ./node_modules/@aws-sdk/middleware-user-agent/dist-es/check-features.js

const ACCOUNT_ID_ENDPOINT_REGEX = /\d{12}\.ddb/;
async function checkFeatures(context, config, args) {
    const request = args.request;
    if (request?.headers?.["smithy-protocol"] === "rpc-v2-cbor") {
        setFeature(context, "PROTOCOL_RPC_V2_CBOR", "M");
    }
    if (typeof config.retryStrategy === "function") {
        const retryStrategy = await config.retryStrategy();
        if (typeof retryStrategy.acquireInitialRetryToken === "function") {
            if (retryStrategy.constructor?.name?.includes("Adaptive")) {
                setFeature(context, "RETRY_MODE_ADAPTIVE", "F");
            }
            else {
                setFeature(context, "RETRY_MODE_STANDARD", "E");
            }
        }
        else {
            setFeature(context, "RETRY_MODE_LEGACY", "D");
        }
    }
    if (typeof config.accountIdEndpointMode === "function") {
        const endpointV2 = context.endpointV2;
        if (String(endpointV2?.url?.hostname).match(ACCOUNT_ID_ENDPOINT_REGEX)) {
            setFeature(context, "ACCOUNT_ID_ENDPOINT", "O");
        }
        switch (await config.accountIdEndpointMode?.()) {
            case "disabled":
                setFeature(context, "ACCOUNT_ID_MODE_DISABLED", "Q");
                break;
            case "preferred":
                setFeature(context, "ACCOUNT_ID_MODE_PREFERRED", "P");
                break;
            case "required":
                setFeature(context, "ACCOUNT_ID_MODE_REQUIRED", "R");
                break;
        }
    }
    const identity = context.__smithy_context?.selectedHttpAuthScheme?.identity;
    if (identity?.$source) {
        const credentials = identity;
        if (credentials.accountId) {
            setFeature(context, "RESOLVED_ACCOUNT_ID", "T");
        }
        for (const [key, value] of Object.entries(credentials.$source ?? {})) {
            setFeature(context, key, value);
        }
    }
}

;// ./node_modules/@aws-sdk/middleware-user-agent/dist-es/constants.js
const USER_AGENT = "user-agent";
const X_AMZ_USER_AGENT = "x-amz-user-agent";
const SPACE = " ";
const UA_NAME_SEPARATOR = "/";
const UA_NAME_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;
const UA_VALUE_ESCAPE_REGEX = /[^\!\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w\#]/g;
const UA_ESCAPE_CHAR = "-";

;// ./node_modules/@aws-sdk/middleware-user-agent/dist-es/encode-features.js
const BYTE_LIMIT = 1024;
function encodeFeatures(features) {
    let buffer = "";
    for (const key in features) {
        const val = features[key];
        if (buffer.length + val.length + 1 <= BYTE_LIMIT) {
            if (buffer.length) {
                buffer += "," + val;
            }
            else {
                buffer += val;
            }
            continue;
        }
        break;
    }
    return buffer;
}

;// ./node_modules/@aws-sdk/middleware-user-agent/dist-es/user-agent-middleware.js





const userAgentMiddleware = (options) => (next, context) => async (args) => {
    const { request } = args;
    if (!httpRequest/* HttpRequest */.K.isInstance(request)) {
        return next(args);
    }
    const { headers } = request;
    const userAgent = context?.userAgent?.map(escapeUserAgent) || [];
    const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
    await checkFeatures(context, options, args);
    const awsContext = context;
    defaultUserAgent.push(`m/${encodeFeatures(Object.assign({}, context.__smithy_context?.features, awsContext.__aws_sdk_context?.features))}`);
    const customUserAgent = options?.customUserAgent?.map(escapeUserAgent) || [];
    const appId = await options.userAgentAppId();
    if (appId) {
        defaultUserAgent.push(escapeUserAgent([`app/${appId}`]));
    }
    const prefix = (0,dist_es/* getUserAgentPrefix */.vL)();
    const sdkUserAgentValue = (prefix ? [prefix] : [])
        .concat([...defaultUserAgent, ...userAgent, ...customUserAgent])
        .join(SPACE);
    const normalUAValue = [
        ...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")),
        ...customUserAgent,
    ].join(SPACE);
    if (options.runtime !== "browser") {
        if (normalUAValue) {
            headers[X_AMZ_USER_AGENT] = headers[X_AMZ_USER_AGENT]
                ? `${headers[USER_AGENT]} ${normalUAValue}`
                : normalUAValue;
        }
        headers[USER_AGENT] = sdkUserAgentValue;
    }
    else {
        headers[X_AMZ_USER_AGENT] = sdkUserAgentValue;
    }
    return next({
        ...args,
        request,
    });
};
const escapeUserAgent = (userAgentPair) => {
    const name = userAgentPair[0]
        .split(UA_NAME_SEPARATOR)
        .map((part) => part.replace(UA_NAME_ESCAPE_REGEX, UA_ESCAPE_CHAR))
        .join(UA_NAME_SEPARATOR);
    const version = userAgentPair[1]?.replace(UA_VALUE_ESCAPE_REGEX, UA_ESCAPE_CHAR);
    const prefixSeparatorIndex = name.indexOf(UA_NAME_SEPARATOR);
    const prefix = name.substring(0, prefixSeparatorIndex);
    let uaName = name.substring(prefixSeparatorIndex + 1);
    if (prefix === "api") {
        uaName = uaName.toLowerCase();
    }
    return [prefix, uaName, version]
        .filter((item) => item && item.length > 0)
        .reduce((acc, item, index) => {
        switch (index) {
            case 0:
                return item;
            case 1:
                return `${acc}/${item}`;
            default:
                return `${acc}#${item}`;
        }
    }, "");
};
const getUserAgentMiddlewareOptions = {
    name: "getUserAgentMiddleware",
    step: "build",
    priority: "low",
    tags: ["SET_USER_AGENT", "USER_AGENT"],
    override: true,
};
const getUserAgentPlugin = (config) => ({
    applyToStack: (clientStack) => {
        clientStack.add(userAgentMiddleware(config), getUserAgentMiddlewareOptions);
    },
});


/***/ }),

/***/ 8062:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ chain)
/* harmony export */ });
/* harmony import */ var _ProviderError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6014);

const chain = (...providers) => async () => {
    if (providers.length === 0) {
        throw new _ProviderError__WEBPACK_IMPORTED_MODULE_0__/* .ProviderError */ .m("No providers in chain");
    }
    let lastProviderError;
    for (const provider of providers) {
        try {
            const credentials = await provider();
            return credentials;
        }
        catch (err) {
            lastProviderError = err;
            if (err?.tryNextLink) {
                continue;
            }
            throw err;
        }
    }
    throw lastProviderError;
};


/***/ }),

/***/ 8218:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   w: () => (/* binding */ collectBodyString)
/* harmony export */ });
/* harmony import */ var _smithy_smithy_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1071);
/* harmony import */ var _smithy_util_utf8__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7638);


const collectBodyString = (streamBody, context) => (0,_smithy_smithy_client__WEBPACK_IMPORTED_MODULE_0__/* .collectBody */ .P)(streamBody, context).then((body) => (context?.utf8Encoder ?? _smithy_util_utf8__WEBPACK_IMPORTED_MODULE_1__/* .toUtf8 */ .P)(body));


/***/ }),

/***/ 8246:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  pf: () => (/* binding */ createDefaultUserAgentProvider)
});

// UNUSED EXPORTS: crtAvailability, defaultUserAgent

// EXTERNAL MODULE: external "os"
var external_os_ = __webpack_require__(857);
;// external "process"
const external_process_namespaceObject = require("process");
;// ./node_modules/@aws-sdk/util-user-agent-node/dist-es/crt-availability.js
const crtAvailability = {
    isCrtAvailable: false,
};

;// ./node_modules/@aws-sdk/util-user-agent-node/dist-es/is-crt-available.js

const isCrtAvailable = () => {
    if (crtAvailability.isCrtAvailable) {
        return ["md/crt-avail"];
    }
    return null;
};

;// ./node_modules/@aws-sdk/util-user-agent-node/dist-es/defaultUserAgent.js




const createDefaultUserAgentProvider = ({ serviceId, clientVersion }) => {
    return async (config) => {
        const sections = [
            ["aws-sdk-js", clientVersion],
            ["ua", "2.1"],
            [`os/${(0,external_os_.platform)()}`, (0,external_os_.release)()],
            ["lang/js"],
            ["md/nodejs", `${external_process_namespaceObject.versions.node}`],
        ];
        const crtAvailable = isCrtAvailable();
        if (crtAvailable) {
            sections.push(crtAvailable);
        }
        if (serviceId) {
            sections.push([`api/${serviceId}`, clientVersion]);
        }
        if (external_process_namespaceObject.env.AWS_EXECUTION_ENV) {
            sections.push([`exec-env/${external_process_namespaceObject.env.AWS_EXECUTION_ENV}`]);
        }
        const appId = await config?.userAgentAppId?.();
        const resolvedUserAgent = appId ? [...sections, [`app/${appId}`]] : [...sections];
        return resolvedUserAgent;
    };
};
const defaultUserAgent = (/* unused pure expression or super */ null && (createDefaultUserAgentProvider));


/***/ }),

/***/ 8462:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ toEndpointV1)
/* harmony export */ });
/* harmony import */ var _smithy_url_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2641);

const toEndpointV1 = (endpoint) => {
    if (typeof endpoint === "object") {
        if ("url" in endpoint) {
            return (0,_smithy_url_parser__WEBPACK_IMPORTED_MODULE_0__/* .parseUrl */ .D)(endpoint.url);
        }
        return endpoint;
    }
    return (0,_smithy_url_parser__WEBPACK_IMPORTED_MODULE_0__/* .parseUrl */ .D)(endpoint);
};


/***/ }),

/***/ 8603:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  u: () => (/* binding */ Command)
});

// EXTERNAL MODULE: ./node_modules/@smithy/middleware-stack/dist-es/MiddlewareStack.js
var MiddlewareStack = __webpack_require__(1671);
// EXTERNAL MODULE: ./node_modules/@smithy/types/dist-es/middleware.js
var middleware = __webpack_require__(7267);
;// ./node_modules/@smithy/core/dist-es/submodules/schema/deref.js
const deref = (schemaRef) => {
    if (typeof schemaRef === "function") {
        return schemaRef();
    }
    return schemaRef;
};

;// ./node_modules/@smithy/core/dist-es/submodules/schema/TypeRegistry.js
class TypeRegistry {
    constructor(namespace, schemas = new Map()) {
        this.namespace = namespace;
        this.schemas = schemas;
    }
    static for(namespace) {
        if (!TypeRegistry.registries.has(namespace)) {
            TypeRegistry.registries.set(namespace, new TypeRegistry(namespace));
        }
        return TypeRegistry.registries.get(namespace);
    }
    register(shapeId, schema) {
        const qualifiedName = this.normalizeShapeId(shapeId);
        const registry = TypeRegistry.for(this.getNamespace(shapeId));
        registry.schemas.set(qualifiedName, schema);
    }
    getSchema(shapeId) {
        const id = this.normalizeShapeId(shapeId);
        if (!this.schemas.has(id)) {
            throw new Error(`@smithy/core/schema - schema not found for ${id}`);
        }
        return this.schemas.get(id);
    }
    getBaseException() {
        for (const [id, schema] of this.schemas.entries()) {
            if (id.startsWith("smithy.ts.sdk.synthetic.") && id.endsWith("ServiceException")) {
                return schema;
            }
        }
        return undefined;
    }
    find(predicate) {
        return [...this.schemas.values()].find(predicate);
    }
    destroy() {
        TypeRegistry.registries.delete(this.namespace);
        this.schemas.clear();
    }
    normalizeShapeId(shapeId) {
        if (shapeId.includes("#")) {
            return shapeId;
        }
        return this.namespace + "#" + shapeId;
    }
    getNamespace(shapeId) {
        return this.normalizeShapeId(shapeId).split("#")[0];
    }
}
TypeRegistry.registries = new Map();

;// ./node_modules/@smithy/core/dist-es/submodules/schema/schemas/Schema.js

class Schema_Schema {
    static assign(instance, values) {
        const schema = Object.assign(instance, values);
        TypeRegistry.for(schema.namespace).register(schema.name, schema);
        return schema;
    }
    static [Symbol.hasInstance](lhs) {
        const isPrototype = this.prototype.isPrototypeOf(lhs);
        if (!isPrototype && typeof lhs === "object" && lhs !== null) {
            const list = lhs;
            return list.symbol === this.symbol;
        }
        return isPrototype;
    }
    getName() {
        return this.namespace + "#" + this.name;
    }
}

;// ./node_modules/@smithy/core/dist-es/submodules/schema/schemas/ListSchema.js

class ListSchema extends Schema_Schema {
    constructor() {
        super(...arguments);
        this.symbol = ListSchema.symbol;
    }
}
ListSchema.symbol = Symbol.for("@smithy/lis");
const list = (namespace, name, traits, valueSchema) => Schema.assign(new ListSchema(), {
    name,
    namespace,
    traits,
    valueSchema,
});

;// ./node_modules/@smithy/core/dist-es/submodules/schema/schemas/MapSchema.js

class MapSchema extends Schema_Schema {
    constructor() {
        super(...arguments);
        this.symbol = MapSchema.symbol;
    }
}
MapSchema.symbol = Symbol.for("@smithy/map");
const map = (namespace, name, traits, keySchema, valueSchema) => Schema.assign(new MapSchema(), {
    name,
    namespace,
    traits,
    keySchema,
    valueSchema,
});

;// ./node_modules/@smithy/core/dist-es/submodules/schema/schemas/sentinels.js
const SCHEMA = {
    BLOB: 21,
    STREAMING_BLOB: 42,
    BOOLEAN: 2,
    STRING: 0,
    NUMERIC: 1,
    BIG_INTEGER: 17,
    BIG_DECIMAL: 19,
    DOCUMENT: 15,
    TIMESTAMP_DEFAULT: 4,
    TIMESTAMP_DATE_TIME: 5,
    TIMESTAMP_HTTP_DATE: 6,
    TIMESTAMP_EPOCH_SECONDS: 7,
    LIST_MODIFIER: 64,
    MAP_MODIFIER: 128,
};

;// ./node_modules/@smithy/core/dist-es/submodules/schema/schemas/SimpleSchema.js

class SimpleSchema extends Schema_Schema {
    constructor() {
        super(...arguments);
        this.symbol = SimpleSchema.symbol;
    }
}
SimpleSchema.symbol = Symbol.for("@smithy/sim");
const sim = (namespace, name, schemaRef, traits) => Schema.assign(new SimpleSchema(), {
    name,
    namespace,
    traits,
    schemaRef,
});

;// ./node_modules/@smithy/core/dist-es/submodules/schema/schemas/StructureSchema.js

class StructureSchema extends Schema_Schema {
    constructor() {
        super(...arguments);
        this.symbol = StructureSchema.symbol;
    }
}
StructureSchema.symbol = Symbol.for("@smithy/str");
const struct = (namespace, name, traits, memberNames, memberList) => Schema.assign(new StructureSchema(), {
    name,
    namespace,
    traits,
    memberNames,
    memberList,
});

;// ./node_modules/@smithy/core/dist-es/submodules/schema/schemas/NormalizedSchema.js







class NormalizedSchema {
    constructor(ref, memberName) {
        this.ref = ref;
        this.memberName = memberName;
        this.symbol = NormalizedSchema.symbol;
        const traitStack = [];
        let _ref = ref;
        let schema = ref;
        this._isMemberSchema = false;
        while (Array.isArray(_ref)) {
            traitStack.push(_ref[1]);
            _ref = _ref[0];
            schema = deref(_ref);
            this._isMemberSchema = true;
        }
        if (traitStack.length > 0) {
            this.memberTraits = {};
            for (let i = traitStack.length - 1; i >= 0; --i) {
                const traitSet = traitStack[i];
                Object.assign(this.memberTraits, NormalizedSchema.translateTraits(traitSet));
            }
        }
        else {
            this.memberTraits = 0;
        }
        if (schema instanceof NormalizedSchema) {
            const computedMemberTraits = this.memberTraits;
            Object.assign(this, schema);
            this.memberTraits = Object.assign({}, computedMemberTraits, schema.getMemberTraits(), this.getMemberTraits());
            this.normalizedTraits = void 0;
            this.memberName = memberName ?? schema.memberName;
            return;
        }
        this.schema = deref(schema);
        if (this.schema && typeof this.schema === "object") {
            this.traits = this.schema?.traits ?? {};
        }
        else {
            this.traits = 0;
        }
        this.name =
            (this.schema instanceof Schema_Schema ? this.schema.getName?.() : void 0) ?? this.memberName ?? this.getSchemaName();
        if (this._isMemberSchema && !memberName) {
            throw new Error(`@smithy/core/schema - NormalizedSchema member init ${this.getName(true)} missing member name.`);
        }
    }
    static [Symbol.hasInstance](lhs) {
        return Schema_Schema[Symbol.hasInstance].bind(this)(lhs);
    }
    static of(ref) {
        if (ref instanceof NormalizedSchema) {
            return ref;
        }
        if (Array.isArray(ref)) {
            const [ns, traits] = ref;
            if (ns instanceof NormalizedSchema) {
                Object.assign(ns.getMergedTraits(), NormalizedSchema.translateTraits(traits));
                return ns;
            }
            throw new Error(`@smithy/core/schema - may not init unwrapped member schema=${JSON.stringify(ref, null, 2)}.`);
        }
        return new NormalizedSchema(ref);
    }
    static translateTraits(indicator) {
        if (typeof indicator === "object") {
            return indicator;
        }
        indicator = indicator | 0;
        const traits = {};
        let i = 0;
        for (const trait of [
            "httpLabel",
            "idempotent",
            "idempotencyToken",
            "sensitive",
            "httpPayload",
            "httpResponseCode",
            "httpQueryParams",
        ]) {
            if (((indicator >> i++) & 1) === 1) {
                traits[trait] = 1;
            }
        }
        return traits;
    }
    getSchema() {
        if (this.schema instanceof NormalizedSchema) {
            Object.assign(this, { schema: this.schema.getSchema() });
            return this.schema;
        }
        if (this.schema instanceof SimpleSchema) {
            return deref(this.schema.schemaRef);
        }
        return deref(this.schema);
    }
    getName(withNamespace = false) {
        if (!withNamespace) {
            if (this.name && this.name.includes("#")) {
                return this.name.split("#")[1];
            }
        }
        return this.name || undefined;
    }
    getMemberName() {
        if (!this.isMemberSchema()) {
            throw new Error(`@smithy/core/schema - non-member schema: ${this.getName(true)}`);
        }
        return this.memberName;
    }
    isMemberSchema() {
        return this._isMemberSchema;
    }
    isUnitSchema() {
        return this.getSchema() === "unit";
    }
    isListSchema() {
        const inner = this.getSchema();
        if (typeof inner === "number") {
            return inner >= SCHEMA.LIST_MODIFIER && inner < SCHEMA.MAP_MODIFIER;
        }
        return inner instanceof ListSchema;
    }
    isMapSchema() {
        const inner = this.getSchema();
        if (typeof inner === "number") {
            return inner >= SCHEMA.MAP_MODIFIER && inner <= 255;
        }
        return inner instanceof MapSchema;
    }
    isStructSchema() {
        const inner = this.getSchema();
        return (inner !== null && typeof inner === "object" && "members" in inner) || inner instanceof StructureSchema;
    }
    isBlobSchema() {
        return this.getSchema() === SCHEMA.BLOB || this.getSchema() === SCHEMA.STREAMING_BLOB;
    }
    isTimestampSchema() {
        const schema = this.getSchema();
        return typeof schema === "number" && schema >= SCHEMA.TIMESTAMP_DEFAULT && schema <= SCHEMA.TIMESTAMP_EPOCH_SECONDS;
    }
    isDocumentSchema() {
        return this.getSchema() === SCHEMA.DOCUMENT;
    }
    isStringSchema() {
        return this.getSchema() === SCHEMA.STRING;
    }
    isBooleanSchema() {
        return this.getSchema() === SCHEMA.BOOLEAN;
    }
    isNumericSchema() {
        return this.getSchema() === SCHEMA.NUMERIC;
    }
    isBigIntegerSchema() {
        return this.getSchema() === SCHEMA.BIG_INTEGER;
    }
    isBigDecimalSchema() {
        return this.getSchema() === SCHEMA.BIG_DECIMAL;
    }
    isStreaming() {
        const streaming = !!this.getMergedTraits().streaming;
        if (streaming) {
            return true;
        }
        return this.getSchema() === SCHEMA.STREAMING_BLOB;
    }
    isIdempotencyToken() {
        if (this.normalizedTraits) {
            return !!this.normalizedTraits.idempotencyToken;
        }
        for (const traits of [this.traits, this.memberTraits]) {
            if (typeof traits === "number") {
                if ((traits & 0b0100) === 0b0100) {
                    return true;
                }
            }
            else if (typeof traits === "object") {
                if (!!traits.idempotencyToken) {
                    return true;
                }
            }
        }
        return false;
    }
    getMergedTraits() {
        return (this.normalizedTraits ??
            (this.normalizedTraits = {
                ...this.getOwnTraits(),
                ...this.getMemberTraits(),
            }));
    }
    getMemberTraits() {
        return NormalizedSchema.translateTraits(this.memberTraits);
    }
    getOwnTraits() {
        return NormalizedSchema.translateTraits(this.traits);
    }
    getKeySchema() {
        if (this.isDocumentSchema()) {
            return this.memberFrom([SCHEMA.DOCUMENT, 0], "key");
        }
        if (!this.isMapSchema()) {
            throw new Error(`@smithy/core/schema - cannot get key for non-map: ${this.getName(true)}`);
        }
        const schema = this.getSchema();
        if (typeof schema === "number") {
            return this.memberFrom([63 & schema, 0], "key");
        }
        return this.memberFrom([schema.keySchema, 0], "key");
    }
    getValueSchema() {
        const schema = this.getSchema();
        if (typeof schema === "number") {
            if (this.isMapSchema()) {
                return this.memberFrom([63 & schema, 0], "value");
            }
            else if (this.isListSchema()) {
                return this.memberFrom([63 & schema, 0], "member");
            }
        }
        if (schema && typeof schema === "object") {
            if (this.isStructSchema()) {
                throw new Error(`may not getValueSchema() on structure ${this.getName(true)}`);
            }
            const collection = schema;
            if ("valueSchema" in collection) {
                if (this.isMapSchema()) {
                    return this.memberFrom([collection.valueSchema, 0], "value");
                }
                else if (this.isListSchema()) {
                    return this.memberFrom([collection.valueSchema, 0], "member");
                }
            }
        }
        if (this.isDocumentSchema()) {
            return this.memberFrom([SCHEMA.DOCUMENT, 0], "value");
        }
        throw new Error(`@smithy/core/schema - ${this.getName(true)} has no value member.`);
    }
    hasMemberSchema(member) {
        if (this.isStructSchema()) {
            const struct = this.getSchema();
            return struct.memberNames.includes(member);
        }
        return false;
    }
    getMemberSchema(member) {
        if (this.isStructSchema()) {
            const struct = this.getSchema();
            if (!struct.memberNames.includes(member)) {
                throw new Error(`@smithy/core/schema - ${this.getName(true)} has no member=${member}.`);
            }
            const i = struct.memberNames.indexOf(member);
            const memberSchema = struct.memberList[i];
            return this.memberFrom(Array.isArray(memberSchema) ? memberSchema : [memberSchema, 0], member);
        }
        if (this.isDocumentSchema()) {
            return this.memberFrom([SCHEMA.DOCUMENT, 0], member);
        }
        throw new Error(`@smithy/core/schema - ${this.getName(true)} has no members.`);
    }
    getMemberSchemas() {
        const buffer = {};
        try {
            for (const [k, v] of this.structIterator()) {
                buffer[k] = v;
            }
        }
        catch (ignored) { }
        return buffer;
    }
    getEventStreamMember() {
        if (this.isStructSchema()) {
            for (const [memberName, memberSchema] of this.structIterator()) {
                if (memberSchema.isStreaming() && memberSchema.isStructSchema()) {
                    return memberName;
                }
            }
        }
        return "";
    }
    *structIterator() {
        if (this.isUnitSchema()) {
            return;
        }
        if (!this.isStructSchema()) {
            throw new Error("@smithy/core/schema - cannot iterate non-struct schema.");
        }
        const struct = this.getSchema();
        for (let i = 0; i < struct.memberNames.length; ++i) {
            yield [struct.memberNames[i], this.memberFrom([struct.memberList[i], 0], struct.memberNames[i])];
        }
    }
    memberFrom(memberSchema, memberName) {
        if (memberSchema instanceof NormalizedSchema) {
            return Object.assign(memberSchema, {
                memberName,
                _isMemberSchema: true,
            });
        }
        return new NormalizedSchema(memberSchema, memberName);
    }
    getSchemaName() {
        const schema = this.getSchema();
        if (typeof schema === "number") {
            const _schema = 63 & schema;
            const container = 192 & schema;
            const type = Object.entries(SCHEMA).find(([, value]) => {
                return value === _schema;
            })?.[0] ?? "Unknown";
            switch (container) {
                case SCHEMA.MAP_MODIFIER:
                    return `${type}Map`;
                case SCHEMA.LIST_MODIFIER:
                    return `${type}List`;
                case 0:
                    return type;
            }
        }
        return "Unknown";
    }
}
NormalizedSchema.symbol = Symbol.for("@smithy/nor");

;// ./node_modules/@smithy/smithy-client/dist-es/schemaLogFilter.js

const SENSITIVE_STRING = "***SensitiveInformation***";
function schemaLogFilter(schema, data) {
    if (data == null) {
        return data;
    }
    const ns = NormalizedSchema.of(schema);
    if (ns.getMergedTraits().sensitive) {
        return SENSITIVE_STRING;
    }
    if (ns.isListSchema()) {
        const isSensitive = !!ns.getValueSchema().getMergedTraits().sensitive;
        if (isSensitive) {
            return SENSITIVE_STRING;
        }
    }
    else if (ns.isMapSchema()) {
        const isSensitive = !!ns.getKeySchema().getMergedTraits().sensitive || !!ns.getValueSchema().getMergedTraits().sensitive;
        if (isSensitive) {
            return SENSITIVE_STRING;
        }
    }
    else if (ns.isStructSchema() && typeof data === "object") {
        const object = data;
        const newObject = {};
        for (const [member, memberNs] of ns.structIterator()) {
            if (object[member] != null) {
                newObject[member] = schemaLogFilter(memberNs, object[member]);
            }
        }
        return newObject;
    }
    return data;
}

;// ./node_modules/@smithy/smithy-client/dist-es/command.js



class Command {
    constructor() {
        this.middlewareStack = (0,MiddlewareStack/* constructStack */.o)();
    }
    static classBuilder() {
        return new ClassBuilder();
    }
    resolveMiddlewareWithContext(clientStack, configuration, options, { middlewareFn, clientName, commandName, inputFilterSensitiveLog, outputFilterSensitiveLog, smithyContext, additionalContext, CommandCtor, }) {
        for (const mw of middlewareFn.bind(this)(CommandCtor, clientStack, configuration, options)) {
            this.middlewareStack.use(mw);
        }
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog,
            outputFilterSensitiveLog,
            [middleware/* SMITHY_CONTEXT_KEY */.V]: {
                commandInstance: this,
                ...smithyContext,
            },
            ...additionalContext,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
}
class ClassBuilder {
    constructor() {
        this._init = () => { };
        this._ep = {};
        this._middlewareFn = () => [];
        this._commandName = "";
        this._clientName = "";
        this._additionalContext = {};
        this._smithyContext = {};
        this._inputFilterSensitiveLog = undefined;
        this._outputFilterSensitiveLog = undefined;
        this._serializer = null;
        this._deserializer = null;
    }
    init(cb) {
        this._init = cb;
    }
    ep(endpointParameterInstructions) {
        this._ep = endpointParameterInstructions;
        return this;
    }
    m(middlewareSupplier) {
        this._middlewareFn = middlewareSupplier;
        return this;
    }
    s(service, operation, smithyContext = {}) {
        this._smithyContext = {
            service,
            operation,
            ...smithyContext,
        };
        return this;
    }
    c(additionalContext = {}) {
        this._additionalContext = additionalContext;
        return this;
    }
    n(clientName, commandName) {
        this._clientName = clientName;
        this._commandName = commandName;
        return this;
    }
    f(inputFilter = (_) => _, outputFilter = (_) => _) {
        this._inputFilterSensitiveLog = inputFilter;
        this._outputFilterSensitiveLog = outputFilter;
        return this;
    }
    ser(serializer) {
        this._serializer = serializer;
        return this;
    }
    de(deserializer) {
        this._deserializer = deserializer;
        return this;
    }
    sc(operation) {
        this._operationSchema = operation;
        this._smithyContext.operationSchema = operation;
        return this;
    }
    build() {
        const closure = this;
        let CommandRef;
        return (CommandRef = class extends Command {
            static getEndpointParameterInstructions() {
                return closure._ep;
            }
            constructor(...[input]) {
                super();
                this.serialize = closure._serializer;
                this.deserialize = closure._deserializer;
                this.input = input ?? {};
                closure._init(this);
                this.schema = closure._operationSchema;
            }
            resolveMiddleware(stack, configuration, options) {
                return this.resolveMiddlewareWithContext(stack, configuration, options, {
                    CommandCtor: CommandRef,
                    middlewareFn: closure._middlewareFn,
                    clientName: closure._clientName,
                    commandName: closure._commandName,
                    inputFilterSensitiveLog: closure._inputFilterSensitiveLog ??
                        (closure._operationSchema ? schemaLogFilter.bind(null, closure._operationSchema.input) : (_) => _),
                    outputFilterSensitiveLog: closure._outputFilterSensitiveLog ??
                        (closure._operationSchema ? schemaLogFilter.bind(null, closure._operationSchema.output) : (_) => _),
                    smithyContext: closure._smithyContext,
                    additionalContext: closure._additionalContext,
                });
            }
        });
    }
}


/***/ }),

/***/ 8611:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 8829:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  k: () => (/* binding */ getEndpointFromConfig)
});

// EXTERNAL MODULE: ./node_modules/@smithy/node-config-provider/dist-es/configLoader.js + 5 modules
var configLoader = __webpack_require__(4013);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/loadSharedConfigFiles.js + 2 modules
var loadSharedConfigFiles = __webpack_require__(5546);
;// ./node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointUrlConfig.js

const ENV_ENDPOINT_URL = "AWS_ENDPOINT_URL";
const CONFIG_ENDPOINT_URL = "endpoint_url";
const getEndpointUrlConfig = (serviceId) => ({
    environmentVariableSelector: (env) => {
        const serviceSuffixParts = serviceId.split(" ").map((w) => w.toUpperCase());
        const serviceEndpointUrl = env[[ENV_ENDPOINT_URL, ...serviceSuffixParts].join("_")];
        if (serviceEndpointUrl)
            return serviceEndpointUrl;
        const endpointUrl = env[ENV_ENDPOINT_URL];
        if (endpointUrl)
            return endpointUrl;
        return undefined;
    },
    configFileSelector: (profile, config) => {
        if (config && profile.services) {
            const servicesSection = config[["services", profile.services].join(loadSharedConfigFiles/* CONFIG_PREFIX_SEPARATOR */.Q)];
            if (servicesSection) {
                const servicePrefixParts = serviceId.split(" ").map((w) => w.toLowerCase());
                const endpointUrl = servicesSection[[servicePrefixParts.join("_"), CONFIG_ENDPOINT_URL].join(loadSharedConfigFiles/* CONFIG_PREFIX_SEPARATOR */.Q)];
                if (endpointUrl)
                    return endpointUrl;
            }
        }
        const endpointUrl = profile[CONFIG_ENDPOINT_URL];
        if (endpointUrl)
            return endpointUrl;
        return undefined;
    },
    default: undefined,
});

;// ./node_modules/@smithy/middleware-endpoint/dist-es/adaptors/getEndpointFromConfig.js


const getEndpointFromConfig = async (serviceId) => (0,configLoader/* loadConfig */.Z)(getEndpointUrlConfig(serviceId ?? ""))();


/***/ }),

/***/ 8883:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X: () => (/* binding */ isValidHostLabel)
/* harmony export */ });
const VALID_HOST_LABEL_REGEX = new RegExp(`^(?!.*-$)(?!-)[a-zA-Z0-9-]{1,63}$`);
const isValidHostLabel = (value, allowSubDomains = false) => {
    if (!allowSubDomains) {
        return VALID_HOST_LABEL_REGEX.test(value);
    }
    const labels = value.split(".");
    for (const label of labels) {
        if (!isValidHostLabel(label)) {
            return false;
        }
    }
    return true;
};


/***/ }),

/***/ 8947:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ normalizeProvider)
/* harmony export */ });
const normalizeProvider = (input) => {
    if (typeof input === "function")
        return input;
    const promisified = Promise.resolve(input);
    return () => promisified;
};


/***/ }),

/***/ 9023:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 9212:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  l: () => (/* binding */ requestBuilder)
});

// UNUSED EXPORTS: RequestBuilder

// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/httpRequest.js
var httpRequest = __webpack_require__(7324);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/submodules/protocols/extended-encode-uri-component.js
var extended_encode_uri_component = __webpack_require__(7916);
;// ./node_modules/@smithy/core/dist-es/submodules/protocols/resolve-path.js

const resolvedPath = (resolvedPath, input, memberName, labelValueProvider, uriLabel, isGreedyLabel) => {
    if (input != null && input[memberName] !== undefined) {
        const labelValue = labelValueProvider();
        if (labelValue.length <= 0) {
            throw new Error("Empty value provided for input HTTP label: " + memberName + ".");
        }
        resolvedPath = resolvedPath.replace(uriLabel, isGreedyLabel
            ? labelValue
                .split("/")
                .map((segment) => (0,extended_encode_uri_component/* extendedEncodeURIComponent */.$)(segment))
                .join("/")
            : (0,extended_encode_uri_component/* extendedEncodeURIComponent */.$)(labelValue));
    }
    else {
        throw new Error("No value provided for input HTTP label: " + memberName + ".");
    }
    return resolvedPath;
};

;// ./node_modules/@smithy/core/dist-es/submodules/protocols/requestBuilder.js


function requestBuilder(input, context) {
    return new RequestBuilder(input, context);
}
class RequestBuilder {
    constructor(input, context) {
        this.input = input;
        this.context = context;
        this.query = {};
        this.method = "";
        this.headers = {};
        this.path = "";
        this.body = null;
        this.hostname = "";
        this.resolvePathStack = [];
    }
    async build() {
        const { hostname, protocol = "https", port, path: basePath } = await this.context.endpoint();
        this.path = basePath;
        for (const resolvePath of this.resolvePathStack) {
            resolvePath(this.path);
        }
        return new httpRequest/* HttpRequest */.K({
            protocol,
            hostname: this.hostname || hostname,
            port,
            method: this.method,
            path: this.path,
            query: this.query,
            body: this.body,
            headers: this.headers,
        });
    }
    hn(hostname) {
        this.hostname = hostname;
        return this;
    }
    bp(uriLabel) {
        this.resolvePathStack.push((basePath) => {
            this.path = `${basePath?.endsWith("/") ? basePath.slice(0, -1) : basePath || ""}` + uriLabel;
        });
        return this;
    }
    p(memberName, labelValueProvider, uriLabel, isGreedyLabel) {
        this.resolvePathStack.push((path) => {
            this.path = resolvedPath(path, this.input, memberName, labelValueProvider, uriLabel, isGreedyLabel);
        });
        return this;
    }
    h(headers) {
        this.headers = headers;
        return this;
    }
    q(query) {
        this.query = query;
        return this;
    }
    b(body) {
        this.body = body;
        return this;
    }
    m(method) {
        this.method = method;
        return this;
    }
}


/***/ }),

/***/ 9718:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   n: () => (/* binding */ toBase64)
/* harmony export */ });
/* harmony import */ var _smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6909);
/* harmony import */ var _smithy_util_utf8__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7459);


const toBase64 = (_input) => {
    let input;
    if (typeof _input === "string") {
        input = (0,_smithy_util_utf8__WEBPACK_IMPORTED_MODULE_1__/* .fromUtf8 */ .a)(_input);
    }
    else {
        input = _input;
    }
    if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
        throw new Error("@smithy/util-base64: toBase64 encoder function only accepts string | Uint8Array.");
    }
    return (0,_smithy_util_buffer_from__WEBPACK_IMPORTED_MODULE_0__/* .fromArrayBuffer */ .Q)(input.buffer, input.byteOffset, input.byteLength).toString("base64");
};


/***/ }),

/***/ 9896:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 9915:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hV: () => (/* binding */ NODE_APP_ID_CONFIG_OPTIONS)
/* harmony export */ });
/* unused harmony exports UA_APP_ID_ENV_NAME, UA_APP_ID_INI_NAME */
/* harmony import */ var _aws_sdk_middleware_user_agent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7287);

const UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
const UA_APP_ID_INI_NAME = "sdk_ua_app_id";
const UA_APP_ID_INI_NAME_DEPRECATED = "sdk-ua-app-id";
const NODE_APP_ID_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[UA_APP_ID_ENV_NAME],
    configFileSelector: (profile) => profile[UA_APP_ID_INI_NAME] ?? profile[UA_APP_ID_INI_NAME_DEPRECATED],
    default: _aws_sdk_middleware_user_agent__WEBPACK_IMPORTED_MODULE_0__/* .DEFAULT_UA_APP_ID */ .b,
};


/***/ }),

/***/ 9984:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  xA: () => (/* binding */ getDefaultExtensionConfiguration),
  uv: () => (/* binding */ resolveDefaultRuntimeConfig)
});

// UNUSED EXPORTS: getDefaultClientConfiguration

;// ./node_modules/@smithy/types/dist-es/extensions/checksum.js
var AlgorithmId;
(function (AlgorithmId) {
    AlgorithmId["MD5"] = "md5";
    AlgorithmId["CRC32"] = "crc32";
    AlgorithmId["CRC32C"] = "crc32c";
    AlgorithmId["SHA1"] = "sha1";
    AlgorithmId["SHA256"] = "sha256";
})(AlgorithmId || (AlgorithmId = {}));
const getChecksumConfiguration = (runtimeConfig) => {
    const checksumAlgorithms = [];
    if (runtimeConfig.sha256 !== undefined) {
        checksumAlgorithms.push({
            algorithmId: () => AlgorithmId.SHA256,
            checksumConstructor: () => runtimeConfig.sha256,
        });
    }
    if (runtimeConfig.md5 != undefined) {
        checksumAlgorithms.push({
            algorithmId: () => AlgorithmId.MD5,
            checksumConstructor: () => runtimeConfig.md5,
        });
    }
    return {
        addChecksumAlgorithm(algo) {
            checksumAlgorithms.push(algo);
        },
        checksumAlgorithms() {
            return checksumAlgorithms;
        },
    };
};
const resolveChecksumRuntimeConfig = (clientConfig) => {
    const runtimeConfig = {};
    clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
        runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
    });
    return runtimeConfig;
};

;// ./node_modules/@smithy/smithy-client/dist-es/extensions/checksum.js


const checksum_getChecksumConfiguration = (runtimeConfig) => {
    const checksumAlgorithms = [];
    for (const id in AlgorithmId) {
        const algorithmId = AlgorithmId[id];
        if (runtimeConfig[algorithmId] === undefined) {
            continue;
        }
        checksumAlgorithms.push({
            algorithmId: () => algorithmId,
            checksumConstructor: () => runtimeConfig[algorithmId],
        });
    }
    return {
        addChecksumAlgorithm(algo) {
            checksumAlgorithms.push(algo);
        },
        checksumAlgorithms() {
            return checksumAlgorithms;
        },
    };
};
const checksum_resolveChecksumRuntimeConfig = (clientConfig) => {
    const runtimeConfig = {};
    clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
        runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
    });
    return runtimeConfig;
};

;// ./node_modules/@smithy/smithy-client/dist-es/extensions/retry.js
const getRetryConfiguration = (runtimeConfig) => {
    return {
        setRetryStrategy(retryStrategy) {
            runtimeConfig.retryStrategy = retryStrategy;
        },
        retryStrategy() {
            return runtimeConfig.retryStrategy;
        },
    };
};
const resolveRetryRuntimeConfig = (retryStrategyConfiguration) => {
    const runtimeConfig = {};
    runtimeConfig.retryStrategy = retryStrategyConfiguration.retryStrategy();
    return runtimeConfig;
};

;// ./node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js


const getDefaultExtensionConfiguration = (runtimeConfig) => {
    return Object.assign(checksum_getChecksumConfiguration(runtimeConfig), getRetryConfiguration(runtimeConfig));
};
const getDefaultClientConfiguration = (/* unused pure expression or super */ null && (getDefaultExtensionConfiguration));
const resolveDefaultRuntimeConfig = (config) => {
    return Object.assign(checksum_resolveChecksumRuntimeConfig(config), resolveRetryRuntimeConfig(config));
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			650: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					var installedChunk = require("../" + __webpack_require__.u(chunkId));
/******/ 					if (!installedChunks[chunkId]) {
/******/ 						installChunk(installedChunk);
/******/ 					}
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  warmUp: () => (/* binding */ warmUp)
});

// EXTERNAL MODULE: ./node_modules/@aws-sdk/middleware-host-header/dist-es/index.js
var dist_es = __webpack_require__(1095);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/middleware-logger/dist-es/loggerMiddleware.js
var loggerMiddleware = __webpack_require__(7813);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/middleware-recursion-detection/dist-es/getRecursionDetectionPlugin.js + 2 modules
var getRecursionDetectionPlugin = __webpack_require__(7966);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/middleware-user-agent/dist-es/configurations.js
var configurations = __webpack_require__(7287);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/middleware-user-agent/dist-es/user-agent-middleware.js + 4 modules
var user_agent_middleware = __webpack_require__(8059);
// EXTERNAL MODULE: ./node_modules/@smithy/config-resolver/dist-es/regionConfig/resolveRegionConfig.js + 2 modules
var resolveRegionConfig = __webpack_require__(4303);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/middleware-http-auth-scheme/getHttpAuthSchemeEndpointRuleSetPlugin.js + 2 modules
var getHttpAuthSchemeEndpointRuleSetPlugin = __webpack_require__(2404);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/util-identity-and-auth/DefaultIdentityProviderConfig.js
var DefaultIdentityProviderConfig = __webpack_require__(612);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/middleware-http-signing/getHttpSigningMiddleware.js + 1 modules
var getHttpSigningMiddleware = __webpack_require__(5172);
;// ./node_modules/@smithy/eventstream-serde-config-resolver/dist-es/EventStreamSerdeConfig.js
const resolveEventStreamSerdeConfig = (input) => Object.assign(input, {
    eventStreamMarshaller: input.eventStreamSerdeProvider(input),
});

// EXTERNAL MODULE: ./node_modules/@smithy/middleware-content-length/dist-es/index.js
var middleware_content_length_dist_es = __webpack_require__(649);
// EXTERNAL MODULE: ./node_modules/@smithy/middleware-endpoint/dist-es/resolveEndpointConfig.js
var resolveEndpointConfig = __webpack_require__(2795);
// EXTERNAL MODULE: ./node_modules/@smithy/middleware-retry/dist-es/configurations.js + 5 modules
var dist_es_configurations = __webpack_require__(5963);
// EXTERNAL MODULE: ./node_modules/@smithy/middleware-retry/dist-es/retryMiddleware.js + 4 modules
var retryMiddleware = __webpack_require__(5144);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/client.js
var client = __webpack_require__(7821);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/resolveAwsSdkSigV4Config.js + 13 modules
var resolveAwsSdkSigV4Config = __webpack_require__(7973);
// EXTERNAL MODULE: ./node_modules/@smithy/util-middleware/dist-es/getSmithyContext.js
var getSmithyContext = __webpack_require__(6116);
// EXTERNAL MODULE: ./node_modules/@smithy/util-middleware/dist-es/normalizeProvider.js
var normalizeProvider = __webpack_require__(8947);
;// ./node_modules/@aws-sdk/client-lambda/dist-es/auth/httpAuthSchemeProvider.js


const defaultLambdaHttpAuthSchemeParametersProvider = async (config, context, input) => {
    return {
        operation: (0,getSmithyContext/* getSmithyContext */.u)(context).operation,
        region: (await (0,normalizeProvider/* normalizeProvider */.t)(config.region)()) ||
            (() => {
                throw new Error("expected `region` to be configured for `aws.auth#sigv4`");
            })(),
    };
};
function createAwsAuthSigv4HttpAuthOption(authParameters) {
    return {
        schemeId: "aws.auth#sigv4",
        signingProperties: {
            name: "lambda",
            region: authParameters.region,
        },
        propertiesExtractor: (config, context) => ({
            signingProperties: {
                config,
                context,
            },
        }),
    };
}
const defaultLambdaHttpAuthSchemeProvider = (authParameters) => {
    const options = [];
    switch (authParameters.operation) {
        default: {
            options.push(createAwsAuthSigv4HttpAuthOption(authParameters));
        }
    }
    return options;
};
const resolveHttpAuthSchemeConfig = (config) => {
    const config_0 = (0,resolveAwsSdkSigV4Config/* resolveAwsSdkSigV4Config */.h)(config);
    return Object.assign(config_0, {
        authSchemePreference: (0,normalizeProvider/* normalizeProvider */.t)(config.authSchemePreference ?? []),
    });
};

;// ./node_modules/@aws-sdk/client-lambda/dist-es/endpoint/EndpointParameters.js
const resolveClientEndpointParameters = (options) => {
    return Object.assign(options, {
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "lambda",
    });
};
const commonParams = {
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
};

;// ./node_modules/@aws-sdk/client-lambda/package.json
const package_namespaceObject = {"rE":"3.896.0"};
// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/client/emitWarningIfUnsupportedVersion.js
var emitWarningIfUnsupportedVersion = __webpack_require__(2741);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/NODE_AUTH_SCHEME_PREFERENCE_OPTIONS.js + 2 modules
var NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = __webpack_require__(4472);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/credential-provider-env/dist-es/fromEnv.js
var fromEnv = __webpack_require__(1478);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/memoize.js
var memoize = __webpack_require__(3783);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/chain.js
var chain = __webpack_require__(8062);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/CredentialsProviderError.js
var CredentialsProviderError = __webpack_require__(3052);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getProfileName.js
var getProfileName = __webpack_require__(6437);
;// ./node_modules/@aws-sdk/credential-provider-node/dist-es/remoteProvider.js

const ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
const remoteProvider = async (init) => {
    const { ENV_CMDS_FULL_URI, ENV_CMDS_RELATIVE_URI, fromContainerMetadata, fromInstanceMetadata } = await __webpack_require__.e(/* import() */ 897).then(__webpack_require__.bind(__webpack_require__, 7897));
    if (process.env[ENV_CMDS_RELATIVE_URI] || process.env[ENV_CMDS_FULL_URI]) {
        init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromHttp/fromContainerMetadata");
        const { fromHttp } = await __webpack_require__.e(/* import() */ 703).then(__webpack_require__.bind(__webpack_require__, 8703));
        return (0,chain/* chain */.c)(fromHttp(init), fromContainerMetadata(init));
    }
    if (process.env[ENV_IMDS_DISABLED] && process.env[ENV_IMDS_DISABLED] !== "false") {
        return async () => {
            throw new CredentialsProviderError/* CredentialsProviderError */.C("EC2 Instance Metadata Service access disabled", { logger: init.logger });
        };
    }
    init.logger?.debug("@aws-sdk/credential-provider-node - remoteProvider::fromInstanceMetadata");
    return fromInstanceMetadata(init);
};

;// ./node_modules/@aws-sdk/credential-provider-node/dist-es/defaultProvider.js




let multipleCredentialSourceWarningEmitted = false;
const defaultProvider = (init = {}) => (0,memoize/* memoize */.B)((0,chain/* chain */.c)(async () => {
    const profile = init.profile ?? process.env[getProfileName/* ENV_PROFILE */.Ch];
    if (profile) {
        const envStaticCredentialsAreSet = process.env[fromEnv/* ENV_KEY */.yG] && process.env[fromEnv/* ENV_SECRET */.pi];
        if (envStaticCredentialsAreSet) {
            if (!multipleCredentialSourceWarningEmitted) {
                const warnFn = init.logger?.warn && init.logger?.constructor?.name !== "NoOpLogger"
                    ? init.logger.warn.bind(init.logger)
                    : console.warn;
                warnFn(`@aws-sdk/credential-provider-node - defaultProvider::fromEnv WARNING:
    Multiple credential sources detected: 
    Both AWS_PROFILE and the pair AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY static credentials are set.
    This SDK will proceed with the AWS_PROFILE value.
    
    However, a future version may change this behavior to prefer the ENV static credentials.
    Please ensure that your environment only sets either the AWS_PROFILE or the
    AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair.
`);
                multipleCredentialSourceWarningEmitted = true;
            }
        }
        throw new CredentialsProviderError/* CredentialsProviderError */.C("AWS_PROFILE is set, skipping fromEnv provider.", {
            logger: init.logger,
            tryNextLink: true,
        });
    }
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromEnv");
    return (0,fromEnv/* fromEnv */.sF)(init)();
}, async () => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromSSO");
    const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init;
    if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C("Skipping SSO provider in default chain (inputs do not include SSO fields).", { logger: init.logger });
    }
    const { fromSSO } = await __webpack_require__.e(/* import() */ 686).then(__webpack_require__.bind(__webpack_require__, 1305));
    return fromSSO(init)();
}, async () => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromIni");
    const { fromIni } = await __webpack_require__.e(/* import() */ 789).then(__webpack_require__.bind(__webpack_require__, 2789));
    return fromIni(init)();
}, async () => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromProcess");
    const { fromProcess } = await __webpack_require__.e(/* import() */ 490).then(__webpack_require__.bind(__webpack_require__, 5109));
    return fromProcess(init)();
}, async () => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::fromTokenFile");
    const { fromTokenFile } = await __webpack_require__.e(/* import() */ 819).then(__webpack_require__.bind(__webpack_require__, 7819));
    return fromTokenFile(init)();
}, async () => {
    init.logger?.debug("@aws-sdk/credential-provider-node - defaultProvider::remoteProvider");
    return (await remoteProvider(init))();
}, async () => {
    throw new CredentialsProviderError/* CredentialsProviderError */.C("Could not load credentials from any providers", {
        tryNextLink: false,
        logger: init.logger,
    });
}), credentialsTreatedAsExpired, credentialsWillNeedRefresh);
const credentialsWillNeedRefresh = (credentials) => credentials?.expiration !== undefined;
const credentialsTreatedAsExpired = (credentials) => credentials?.expiration !== undefined && credentials.expiration.getTime() - Date.now() < 300000;

// EXTERNAL MODULE: ./node_modules/@aws-sdk/util-user-agent-node/dist-es/defaultUserAgent.js + 3 modules
var defaultUserAgent = __webpack_require__(8246);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/util-user-agent-node/dist-es/nodeAppIdConfigOptions.js
var nodeAppIdConfigOptions = __webpack_require__(9915);
// EXTERNAL MODULE: ./node_modules/@smithy/config-resolver/dist-es/regionConfig/config.js
var regionConfig_config = __webpack_require__(4836);
// EXTERNAL MODULE: ./node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseDualstackEndpointConfigOptions.js
var NodeUseDualstackEndpointConfigOptions = __webpack_require__(2184);
// EXTERNAL MODULE: ./node_modules/@smithy/config-resolver/dist-es/endpointsConfig/NodeUseFipsEndpointConfigOptions.js
var NodeUseFipsEndpointConfigOptions = __webpack_require__(4570);
;// ./node_modules/tslib/tslib.es6.mjs
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownKeys = function(o) {
  ownKeys = Object.getOwnPropertyNames || function (o) {
    var ar = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownKeys(o);
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
      });
  }
  return path;
}

/* harmony default export */ const tslib_es6 = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
});

// EXTERNAL MODULE: external "buffer"
var external_buffer_ = __webpack_require__(181);
;// ./node_modules/@aws-crypto/util/node_modules/@smithy/util-buffer-from/dist-es/index.js


const dist_es_fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
    if (!isArrayBuffer(input)) {
        throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
    }
    return Buffer.from(input, offset, length);
};
const fromString = (input, encoding) => {
    if (typeof input !== "string") {
        throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
    }
    return encoding ? external_buffer_.Buffer.from(input, encoding) : external_buffer_.Buffer.from(input);
};

;// ./node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/fromUtf8.js

const fromUtf8_fromUtf8 = (input) => {
    const buf = fromString(input, "utf8");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};

;// ./node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/toUint8Array.js

const toUint8Array = (data) => {
    if (typeof data === "string") {
        return fromUtf8(data);
    }
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    }
    return new Uint8Array(data);
};

;// ./node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/toUtf8.js

const toUtf8 = (input) => {
    if (typeof input === "string") {
        return input;
    }
    if (typeof input !== "object" || typeof input.byteOffset !== "number" || typeof input.byteLength !== "number") {
        throw new Error("@smithy/util-utf8: toUtf8 encoder function only accepts string | Uint8Array.");
    }
    return fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
};

;// ./node_modules/@aws-crypto/util/node_modules/@smithy/util-utf8/dist-es/index.js




;// ./node_modules/@aws-crypto/util/build/module/convertToBuffer.js
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Quick polyfill
var convertToBuffer_fromUtf8 = typeof Buffer !== "undefined" && Buffer.from
    ? function (input) { return Buffer.from(input, "utf8"); }
    : fromUtf8_fromUtf8;
function convertToBuffer(data) {
    // Already a Uint8, do nothing
    if (data instanceof Uint8Array)
        return data;
    if (typeof data === "string") {
        return convertToBuffer_fromUtf8(data);
    }
    if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    }
    return new Uint8Array(data);
}
//# sourceMappingURL=convertToBuffer.js.map
;// ./node_modules/@aws-crypto/util/build/module/isEmptyData.js
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function isEmptyData(data) {
    if (typeof data === "string") {
        return data.length === 0;
    }
    return data.byteLength === 0;
}
//# sourceMappingURL=isEmptyData.js.map
;// ./node_modules/@aws-crypto/util/build/module/numToUint8.js
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
function numToUint8(num) {
    return new Uint8Array([
        (num & 0xff000000) >> 24,
        (num & 0x00ff0000) >> 16,
        (num & 0x0000ff00) >> 8,
        num & 0x000000ff,
    ]);
}
//# sourceMappingURL=numToUint8.js.map
;// ./node_modules/@aws-crypto/util/build/module/uint32ArrayFrom.js
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// IE 11 does not support Array.from, so we do it manually
function uint32ArrayFrom(a_lookUpTable) {
    if (!Uint32Array.from) {
        var return_array = new Uint32Array(a_lookUpTable.length);
        var a_index = 0;
        while (a_index < a_lookUpTable.length) {
            return_array[a_index] = a_lookUpTable[a_index];
            a_index += 1;
        }
        return return_array;
    }
    return Uint32Array.from(a_lookUpTable);
}
//# sourceMappingURL=uint32ArrayFrom.js.map
;// ./node_modules/@aws-crypto/util/build/module/index.js
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0




//# sourceMappingURL=index.js.map
;// ./node_modules/@aws-crypto/crc32/build/module/aws_crc32.js
// Copyright Amazon.com Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0



var AwsCrc32 = /** @class */ (function () {
    function AwsCrc32() {
        this.crc32 = new Crc32();
    }
    AwsCrc32.prototype.update = function (toHash) {
        if (isEmptyData(toHash))
            return;
        this.crc32.update(convertToBuffer(toHash));
    };
    AwsCrc32.prototype.digest = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, numToUint8(this.crc32.digest())];
            });
        });
    };
    AwsCrc32.prototype.reset = function () {
        this.crc32 = new Crc32();
    };
    return AwsCrc32;
}());

//# sourceMappingURL=aws_crc32.js.map
;// ./node_modules/@aws-crypto/crc32/build/module/index.js


function crc32(data) {
    return new Crc32().update(data).digest();
}
var Crc32 = /** @class */ (function () {
    function Crc32() {
        this.checksum = 0xffffffff;
    }
    Crc32.prototype.update = function (data) {
        var e_1, _a;
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var byte = data_1_1.value;
                this.checksum =
                    (this.checksum >>> 8) ^ lookupTable[(this.checksum ^ byte) & 0xff];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    Crc32.prototype.digest = function () {
        return (this.checksum ^ 0xffffffff) >>> 0;
    };
    return Crc32;
}());

// prettier-ignore
var a_lookUpTable = [
    0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA,
    0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3,
    0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988,
    0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91,
    0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE,
    0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7,
    0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC,
    0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5,
    0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172,
    0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B,
    0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940,
    0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59,
    0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116,
    0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F,
    0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924,
    0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D,
    0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A,
    0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433,
    0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818,
    0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01,
    0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E,
    0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457,
    0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C,
    0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65,
    0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2,
    0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB,
    0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0,
    0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9,
    0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086,
    0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F,
    0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4,
    0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD,
    0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A,
    0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683,
    0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8,
    0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1,
    0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE,
    0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7,
    0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC,
    0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5,
    0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252,
    0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B,
    0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60,
    0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79,
    0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236,
    0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F,
    0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04,
    0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D,
    0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A,
    0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713,
    0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38,
    0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21,
    0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E,
    0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777,
    0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C,
    0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45,
    0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2,
    0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB,
    0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0,
    0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9,
    0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6,
    0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF,
    0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94,
    0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D,
];
var lookupTable = uint32ArrayFrom(a_lookUpTable);

//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ./node_modules/@smithy/util-hex-encoding/dist-es/index.js
var util_hex_encoding_dist_es = __webpack_require__(8004);
;// ./node_modules/@smithy/eventstream-codec/dist-es/Int64.js

class Int64 {
    constructor(bytes) {
        this.bytes = bytes;
        if (bytes.byteLength !== 8) {
            throw new Error("Int64 buffers must be exactly 8 bytes");
        }
    }
    static fromNumber(number) {
        if (number > 9223372036854776000 || number < -9223372036854776000) {
            throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
        }
        const bytes = new Uint8Array(8);
        for (let i = 7, remaining = Math.abs(Math.round(number)); i > -1 && remaining > 0; i--, remaining /= 256) {
            bytes[i] = remaining;
        }
        if (number < 0) {
            negate(bytes);
        }
        return new Int64(bytes);
    }
    valueOf() {
        const bytes = this.bytes.slice(0);
        const negative = bytes[0] & 0b10000000;
        if (negative) {
            negate(bytes);
        }
        return parseInt((0,util_hex_encoding_dist_es/* toHex */.n)(bytes), 16) * (negative ? -1 : 1);
    }
    toString() {
        return String(this.valueOf());
    }
}
function negate(bytes) {
    for (let i = 0; i < 8; i++) {
        bytes[i] ^= 0xff;
    }
    for (let i = 7; i > -1; i--) {
        bytes[i]++;
        if (bytes[i] !== 0)
            break;
    }
}

;// ./node_modules/@smithy/eventstream-codec/dist-es/HeaderMarshaller.js


class HeaderMarshaller {
    constructor(toUtf8, fromUtf8) {
        this.toUtf8 = toUtf8;
        this.fromUtf8 = fromUtf8;
    }
    format(headers) {
        const chunks = [];
        for (const headerName of Object.keys(headers)) {
            const bytes = this.fromUtf8(headerName);
            chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
        }
        const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
        let position = 0;
        for (const chunk of chunks) {
            out.set(chunk, position);
            position += chunk.byteLength;
        }
        return out;
    }
    formatHeaderValue(header) {
        switch (header.type) {
            case "boolean":
                return Uint8Array.from([header.value ? 0 : 1]);
            case "byte":
                return Uint8Array.from([2, header.value]);
            case "short":
                const shortView = new DataView(new ArrayBuffer(3));
                shortView.setUint8(0, 3);
                shortView.setInt16(1, header.value, false);
                return new Uint8Array(shortView.buffer);
            case "integer":
                const intView = new DataView(new ArrayBuffer(5));
                intView.setUint8(0, 4);
                intView.setInt32(1, header.value, false);
                return new Uint8Array(intView.buffer);
            case "long":
                const longBytes = new Uint8Array(9);
                longBytes[0] = 5;
                longBytes.set(header.value.bytes, 1);
                return longBytes;
            case "binary":
                const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
                binView.setUint8(0, 6);
                binView.setUint16(1, header.value.byteLength, false);
                const binBytes = new Uint8Array(binView.buffer);
                binBytes.set(header.value, 3);
                return binBytes;
            case "string":
                const utf8Bytes = this.fromUtf8(header.value);
                const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
                strView.setUint8(0, 7);
                strView.setUint16(1, utf8Bytes.byteLength, false);
                const strBytes = new Uint8Array(strView.buffer);
                strBytes.set(utf8Bytes, 3);
                return strBytes;
            case "timestamp":
                const tsBytes = new Uint8Array(9);
                tsBytes[0] = 8;
                tsBytes.set(Int64.fromNumber(header.value.valueOf()).bytes, 1);
                return tsBytes;
            case "uuid":
                if (!UUID_PATTERN.test(header.value)) {
                    throw new Error(`Invalid UUID received: ${header.value}`);
                }
                const uuidBytes = new Uint8Array(17);
                uuidBytes[0] = 9;
                uuidBytes.set((0,util_hex_encoding_dist_es/* fromHex */.a)(header.value.replace(/\-/g, "")), 1);
                return uuidBytes;
        }
    }
    parse(headers) {
        const out = {};
        let position = 0;
        while (position < headers.byteLength) {
            const nameLength = headers.getUint8(position++);
            const name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
            position += nameLength;
            switch (headers.getUint8(position++)) {
                case 0:
                    out[name] = {
                        type: BOOLEAN_TAG,
                        value: true,
                    };
                    break;
                case 1:
                    out[name] = {
                        type: BOOLEAN_TAG,
                        value: false,
                    };
                    break;
                case 2:
                    out[name] = {
                        type: BYTE_TAG,
                        value: headers.getInt8(position++),
                    };
                    break;
                case 3:
                    out[name] = {
                        type: SHORT_TAG,
                        value: headers.getInt16(position, false),
                    };
                    position += 2;
                    break;
                case 4:
                    out[name] = {
                        type: INT_TAG,
                        value: headers.getInt32(position, false),
                    };
                    position += 4;
                    break;
                case 5:
                    out[name] = {
                        type: LONG_TAG,
                        value: new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)),
                    };
                    position += 8;
                    break;
                case 6:
                    const binaryLength = headers.getUint16(position, false);
                    position += 2;
                    out[name] = {
                        type: BINARY_TAG,
                        value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength),
                    };
                    position += binaryLength;
                    break;
                case 7:
                    const stringLength = headers.getUint16(position, false);
                    position += 2;
                    out[name] = {
                        type: STRING_TAG,
                        value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength)),
                    };
                    position += stringLength;
                    break;
                case 8:
                    out[name] = {
                        type: TIMESTAMP_TAG,
                        value: new Date(new Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf()),
                    };
                    position += 8;
                    break;
                case 9:
                    const uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
                    position += 16;
                    out[name] = {
                        type: UUID_TAG,
                        value: `${(0,util_hex_encoding_dist_es/* toHex */.n)(uuidBytes.subarray(0, 4))}-${(0,util_hex_encoding_dist_es/* toHex */.n)(uuidBytes.subarray(4, 6))}-${(0,util_hex_encoding_dist_es/* toHex */.n)(uuidBytes.subarray(6, 8))}-${(0,util_hex_encoding_dist_es/* toHex */.n)(uuidBytes.subarray(8, 10))}-${(0,util_hex_encoding_dist_es/* toHex */.n)(uuidBytes.subarray(10))}`,
                    };
                    break;
                default:
                    throw new Error(`Unrecognized header type tag`);
            }
        }
        return out;
    }
}
var HEADER_VALUE_TYPE;
(function (HEADER_VALUE_TYPE) {
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolTrue"] = 0] = "boolTrue";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["boolFalse"] = 1] = "boolFalse";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byte"] = 2] = "byte";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["short"] = 3] = "short";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["integer"] = 4] = "integer";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["long"] = 5] = "long";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["byteArray"] = 6] = "byteArray";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["string"] = 7] = "string";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["timestamp"] = 8] = "timestamp";
    HEADER_VALUE_TYPE[HEADER_VALUE_TYPE["uuid"] = 9] = "uuid";
})(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
const BOOLEAN_TAG = "boolean";
const BYTE_TAG = "byte";
const SHORT_TAG = "short";
const INT_TAG = "integer";
const LONG_TAG = "long";
const BINARY_TAG = "binary";
const STRING_TAG = "string";
const TIMESTAMP_TAG = "timestamp";
const UUID_TAG = "uuid";
const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;

;// ./node_modules/@smithy/eventstream-codec/dist-es/splitMessage.js

const PRELUDE_MEMBER_LENGTH = 4;
const PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
const CHECKSUM_LENGTH = 4;
const MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
function splitMessage({ byteLength, byteOffset, buffer }) {
    if (byteLength < MINIMUM_MESSAGE_LENGTH) {
        throw new Error("Provided message too short to accommodate event stream message overhead");
    }
    const view = new DataView(buffer, byteOffset, byteLength);
    const messageLength = view.getUint32(0, false);
    if (byteLength !== messageLength) {
        throw new Error("Reported message length does not match received message length");
    }
    const headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
    const expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
    const expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
    const checksummer = new Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
    if (expectedPreludeChecksum !== checksummer.digest()) {
        throw new Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
    }
    checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH)));
    if (expectedMessageChecksum !== checksummer.digest()) {
        throw new Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
    }
    return {
        headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
        body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH)),
    };
}

;// ./node_modules/@smithy/eventstream-codec/dist-es/EventStreamCodec.js



class EventStreamCodec {
    constructor(toUtf8, fromUtf8) {
        this.headerMarshaller = new HeaderMarshaller(toUtf8, fromUtf8);
        this.messageBuffer = [];
        this.isEndOfStream = false;
    }
    feed(message) {
        this.messageBuffer.push(this.decode(message));
    }
    endOfStream() {
        this.isEndOfStream = true;
    }
    getMessage() {
        const message = this.messageBuffer.pop();
        const isEndOfStream = this.isEndOfStream;
        return {
            getMessage() {
                return message;
            },
            isEndOfStream() {
                return isEndOfStream;
            },
        };
    }
    getAvailableMessages() {
        const messages = this.messageBuffer;
        this.messageBuffer = [];
        const isEndOfStream = this.isEndOfStream;
        return {
            getMessages() {
                return messages;
            },
            isEndOfStream() {
                return isEndOfStream;
            },
        };
    }
    encode({ headers: rawHeaders, body }) {
        const headers = this.headerMarshaller.format(rawHeaders);
        const length = headers.byteLength + body.byteLength + 16;
        const out = new Uint8Array(length);
        const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
        const checksum = new Crc32();
        view.setUint32(0, length, false);
        view.setUint32(4, headers.byteLength, false);
        view.setUint32(8, checksum.update(out.subarray(0, 8)).digest(), false);
        out.set(headers, 12);
        out.set(body, headers.byteLength + 12);
        view.setUint32(length - 4, checksum.update(out.subarray(8, length - 4)).digest(), false);
        return out;
    }
    decode(message) {
        const { headers, body } = splitMessage(message);
        return { headers: this.headerMarshaller.parse(headers), body };
    }
    formatHeaders(rawHeaders) {
        return this.headerMarshaller.format(rawHeaders);
    }
}

;// ./node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageDecoderStream.js
class SmithyMessageDecoderStream {
    constructor(options) {
        this.options = options;
    }
    [Symbol.asyncIterator]() {
        return this.asyncIterator();
    }
    async *asyncIterator() {
        for await (const message of this.options.messageStream) {
            const deserialized = await this.options.deserializer(message);
            if (deserialized === undefined)
                continue;
            yield deserialized;
        }
    }
}

;// ./node_modules/@smithy/eventstream-codec/dist-es/MessageDecoderStream.js
class MessageDecoderStream {
    constructor(options) {
        this.options = options;
    }
    [Symbol.asyncIterator]() {
        return this.asyncIterator();
    }
    async *asyncIterator() {
        for await (const bytes of this.options.inputStream) {
            const decoded = this.options.decoder.decode(bytes);
            yield decoded;
        }
    }
}

;// ./node_modules/@smithy/eventstream-codec/dist-es/MessageEncoderStream.js
class MessageEncoderStream {
    constructor(options) {
        this.options = options;
    }
    [Symbol.asyncIterator]() {
        return this.asyncIterator();
    }
    async *asyncIterator() {
        for await (const msg of this.options.messageStream) {
            const encoded = this.options.encoder.encode(msg);
            yield encoded;
        }
        if (this.options.includeEndFrame) {
            yield new Uint8Array(0);
        }
    }
}

;// ./node_modules/@smithy/eventstream-codec/dist-es/SmithyMessageEncoderStream.js
class SmithyMessageEncoderStream {
    constructor(options) {
        this.options = options;
    }
    [Symbol.asyncIterator]() {
        return this.asyncIterator();
    }
    async *asyncIterator() {
        for await (const chunk of this.options.inputStream) {
            const payloadBuf = this.options.serializer(chunk);
            yield payloadBuf;
        }
    }
}

;// ./node_modules/@smithy/eventstream-serde-universal/dist-es/getChunkedStream.js
function getChunkedStream(source) {
    let currentMessageTotalLength = 0;
    let currentMessagePendingLength = 0;
    let currentMessage = null;
    let messageLengthBuffer = null;
    const allocateMessage = (size) => {
        if (typeof size !== "number") {
            throw new Error("Attempted to allocate an event message where size was not a number: " + size);
        }
        currentMessageTotalLength = size;
        currentMessagePendingLength = 4;
        currentMessage = new Uint8Array(size);
        const currentMessageView = new DataView(currentMessage.buffer);
        currentMessageView.setUint32(0, size, false);
    };
    const iterator = async function* () {
        const sourceIterator = source[Symbol.asyncIterator]();
        while (true) {
            const { value, done } = await sourceIterator.next();
            if (done) {
                if (!currentMessageTotalLength) {
                    return;
                }
                else if (currentMessageTotalLength === currentMessagePendingLength) {
                    yield currentMessage;
                }
                else {
                    throw new Error("Truncated event message received.");
                }
                return;
            }
            const chunkLength = value.length;
            let currentOffset = 0;
            while (currentOffset < chunkLength) {
                if (!currentMessage) {
                    const bytesRemaining = chunkLength - currentOffset;
                    if (!messageLengthBuffer) {
                        messageLengthBuffer = new Uint8Array(4);
                    }
                    const numBytesForTotal = Math.min(4 - currentMessagePendingLength, bytesRemaining);
                    messageLengthBuffer.set(value.slice(currentOffset, currentOffset + numBytesForTotal), currentMessagePendingLength);
                    currentMessagePendingLength += numBytesForTotal;
                    currentOffset += numBytesForTotal;
                    if (currentMessagePendingLength < 4) {
                        break;
                    }
                    allocateMessage(new DataView(messageLengthBuffer.buffer).getUint32(0, false));
                    messageLengthBuffer = null;
                }
                const numBytesToWrite = Math.min(currentMessageTotalLength - currentMessagePendingLength, chunkLength - currentOffset);
                currentMessage.set(value.slice(currentOffset, currentOffset + numBytesToWrite), currentMessagePendingLength);
                currentMessagePendingLength += numBytesToWrite;
                currentOffset += numBytesToWrite;
                if (currentMessageTotalLength && currentMessageTotalLength === currentMessagePendingLength) {
                    yield currentMessage;
                    currentMessage = null;
                    currentMessageTotalLength = 0;
                    currentMessagePendingLength = 0;
                }
            }
        }
    };
    return {
        [Symbol.asyncIterator]: iterator,
    };
}

;// ./node_modules/@smithy/eventstream-serde-universal/dist-es/getUnmarshalledStream.js
function getUnmarshalledStream(source, options) {
    const messageUnmarshaller = getMessageUnmarshaller(options.deserializer, options.toUtf8);
    return {
        [Symbol.asyncIterator]: async function* () {
            for await (const chunk of source) {
                const message = options.eventStreamCodec.decode(chunk);
                const type = await messageUnmarshaller(message);
                if (type === undefined)
                    continue;
                yield type;
            }
        },
    };
}
function getMessageUnmarshaller(deserializer, toUtf8) {
    return async function (message) {
        const { value: messageType } = message.headers[":message-type"];
        if (messageType === "error") {
            const unmodeledError = new Error(message.headers[":error-message"].value || "UnknownError");
            unmodeledError.name = message.headers[":error-code"].value;
            throw unmodeledError;
        }
        else if (messageType === "exception") {
            const code = message.headers[":exception-type"].value;
            const exception = { [code]: message };
            const deserializedException = await deserializer(exception);
            if (deserializedException.$unknown) {
                const error = new Error(toUtf8(message.body));
                error.name = code;
                throw error;
            }
            throw deserializedException[code];
        }
        else if (messageType === "event") {
            const event = {
                [message.headers[":event-type"].value]: message,
            };
            const deserialized = await deserializer(event);
            if (deserialized.$unknown)
                return;
            return deserialized;
        }
        else {
            throw Error(`Unrecognizable event type: ${message.headers[":event-type"].value}`);
        }
    };
}

;// ./node_modules/@smithy/eventstream-serde-universal/dist-es/EventStreamMarshaller.js



class EventStreamMarshaller_EventStreamMarshaller {
    constructor({ utf8Encoder, utf8Decoder }) {
        this.eventStreamCodec = new EventStreamCodec(utf8Encoder, utf8Decoder);
        this.utfEncoder = utf8Encoder;
    }
    deserialize(body, deserializer) {
        const inputStream = getChunkedStream(body);
        return new SmithyMessageDecoderStream({
            messageStream: new MessageDecoderStream({ inputStream, decoder: this.eventStreamCodec }),
            deserializer: getMessageUnmarshaller(deserializer, this.utfEncoder),
        });
    }
    serialize(inputStream, serializer) {
        return new MessageEncoderStream({
            messageStream: new SmithyMessageEncoderStream({ inputStream, serializer }),
            encoder: this.eventStreamCodec,
            includeEndFrame: true,
        });
    }
}

// EXTERNAL MODULE: external "stream"
var external_stream_ = __webpack_require__(2203);
;// ./node_modules/@smithy/eventstream-serde-node/dist-es/utils.js
async function* readabletoIterable(readStream) {
    let streamEnded = false;
    let generationEnded = false;
    const records = new Array();
    readStream.on("error", (err) => {
        if (!streamEnded) {
            streamEnded = true;
        }
        if (err) {
            throw err;
        }
    });
    readStream.on("data", (data) => {
        records.push(data);
    });
    readStream.on("end", () => {
        streamEnded = true;
    });
    while (!generationEnded) {
        const value = await new Promise((resolve) => setTimeout(() => resolve(records.shift()), 0));
        if (value) {
            yield value;
        }
        generationEnded = streamEnded && records.length === 0;
    }
}

;// ./node_modules/@smithy/eventstream-serde-node/dist-es/EventStreamMarshaller.js



class EventStreamMarshaller {
    constructor({ utf8Encoder, utf8Decoder }) {
        this.universalMarshaller = new EventStreamMarshaller_EventStreamMarshaller({
            utf8Decoder,
            utf8Encoder,
        });
    }
    deserialize(body, deserializer) {
        const bodyIterable = typeof body[Symbol.asyncIterator] === "function" ? body : readabletoIterable(body);
        return this.universalMarshaller.deserialize(bodyIterable, deserializer);
    }
    serialize(input, serializer) {
        return external_stream_.Readable.from(this.universalMarshaller.serialize(input, serializer));
    }
}

;// ./node_modules/@smithy/eventstream-serde-node/dist-es/provider.js

const eventStreamSerdeProvider = (options) => new EventStreamMarshaller(options);

// EXTERNAL MODULE: ./node_modules/@smithy/hash-node/dist-es/index.js
var hash_node_dist_es = __webpack_require__(1701);
// EXTERNAL MODULE: ./node_modules/@smithy/node-config-provider/dist-es/configLoader.js + 5 modules
var configLoader = __webpack_require__(4013);
// EXTERNAL MODULE: ./node_modules/@smithy/node-http-handler/dist-es/node-http-handler.js + 9 modules
var node_http_handler = __webpack_require__(2864);
// EXTERNAL MODULE: ./node_modules/@smithy/node-http-handler/dist-es/stream-collector/index.js + 1 modules
var stream_collector = __webpack_require__(5178);
// EXTERNAL MODULE: ./node_modules/@smithy/util-body-length-node/dist-es/calculateBodyLength.js
var calculateBodyLength = __webpack_require__(2291);
// EXTERNAL MODULE: ./node_modules/@smithy/util-retry/dist-es/config.js
var dist_es_config = __webpack_require__(7355);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/AwsSdkSigV4Signer.js + 4 modules
var AwsSdkSigV4Signer = __webpack_require__(6228);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js
var NoOpLogger = __webpack_require__(4098);
// EXTERNAL MODULE: ./node_modules/@smithy/url-parser/dist-es/index.js + 1 modules
var url_parser_dist_es = __webpack_require__(2641);
// EXTERNAL MODULE: ./node_modules/@smithy/util-base64/dist-es/fromBase64.js
var fromBase64 = __webpack_require__(1395);
// EXTERNAL MODULE: ./node_modules/@smithy/util-base64/dist-es/toBase64.js
var toBase64 = __webpack_require__(9718);
// EXTERNAL MODULE: ./node_modules/@smithy/util-utf8/dist-es/fromUtf8.js
var dist_es_fromUtf8 = __webpack_require__(7459);
// EXTERNAL MODULE: ./node_modules/@smithy/util-utf8/dist-es/toUtf8.js
var dist_es_toUtf8 = __webpack_require__(7638);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/util-endpoints/dist-es/index.js + 15 modules
var util_endpoints_dist_es = __webpack_require__(643);
// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/cache/EndpointCache.js
var EndpointCache = __webpack_require__(7461);
// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/resolveEndpoint.js + 28 modules
var resolveEndpoint = __webpack_require__(7167);
// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/utils/customEndpointFunctions.js
var customEndpointFunctions = __webpack_require__(468);
;// ./node_modules/@aws-sdk/client-lambda/dist-es/endpoint/ruleset.js
const s = "required", t = "fn", u = "argv", v = "ref";
const a = true, b = "isSet", c = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h = { [s]: false, "type": "String" }, i = { [s]: true, "default": false, "type": "Boolean" }, j = { [v]: "Endpoint" }, k = { [t]: c, [u]: [{ [v]: "UseFIPS" }, true] }, l = { [t]: c, [u]: [{ [v]: "UseDualStack" }, true] }, m = {}, n = { [t]: "getAttr", [u]: [{ [v]: g }, "supportsFIPS"] }, o = { [t]: c, [u]: [true, { [t]: "getAttr", [u]: [{ [v]: g }, "supportsDualStack"] }] }, p = [k], q = [l], r = [{ [v]: "Region" }];
const _data = { version: "1.0", parameters: { Region: h, UseDualStack: i, UseFIPS: i, Endpoint: h }, rules: [{ conditions: [{ [t]: b, [u]: [j] }], rules: [{ conditions: p, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: q, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: j, properties: m, headers: m }, type: e }], type: f }, { conditions: [{ [t]: b, [u]: r }], rules: [{ conditions: [{ [t]: "aws.partition", [u]: r, assign: g }], rules: [{ conditions: [k, l], rules: [{ conditions: [{ [t]: c, [u]: [a, n] }, o], rules: [{ endpoint: { url: "https://lambda-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m, headers: m }, type: e }], type: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f }, { conditions: p, rules: [{ conditions: [{ [t]: c, [u]: [n, a] }], rules: [{ endpoint: { url: "https://lambda-fips.{Region}.{PartitionResult#dnsSuffix}", properties: m, headers: m }, type: e }], type: f }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f }, { conditions: q, rules: [{ conditions: [o], rules: [{ endpoint: { url: "https://lambda.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: m, headers: m }, type: e }], type: f }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f }, { endpoint: { url: "https://lambda.{Region}.{PartitionResult#dnsSuffix}", properties: m, headers: m }, type: e }], type: f }], type: f }, { error: "Invalid Configuration: Missing Region", type: d }] };
const ruleSet = _data;

;// ./node_modules/@aws-sdk/client-lambda/dist-es/endpoint/endpointResolver.js



const cache = new EndpointCache/* EndpointCache */.k({
    size: 50,
    params: ["Endpoint", "Region", "UseDualStack", "UseFIPS"],
});
const defaultEndpointResolver = (endpointParams, context = {}) => {
    return cache.get(endpointParams, () => (0,resolveEndpoint/* resolveEndpoint */.s)(ruleSet, {
        endpointParams: endpointParams,
        logger: context.logger,
    }));
};
customEndpointFunctions/* customEndpointFunctions */.m.aws = util_endpoints_dist_es/* awsEndpointFunctions */.UF;

;// ./node_modules/@aws-sdk/client-lambda/dist-es/runtimeConfig.shared.js







const getRuntimeConfig = (config) => {
    return {
        apiVersion: "2015-03-31",
        base64Decoder: config?.base64Decoder ?? fromBase64/* fromBase64 */.E,
        base64Encoder: config?.base64Encoder ?? toBase64/* toBase64 */.n,
        disableHostPrefix: config?.disableHostPrefix ?? false,
        endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
        extensions: config?.extensions ?? [],
        httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultLambdaHttpAuthSchemeProvider,
        httpAuthSchemes: config?.httpAuthSchemes ?? [
            {
                schemeId: "aws.auth#sigv4",
                identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
                signer: new AwsSdkSigV4Signer/* AwsSdkSigV4Signer */.f2(),
            },
        ],
        logger: config?.logger ?? new NoOpLogger/* NoOpLogger */.N(),
        serviceId: config?.serviceId ?? "Lambda",
        urlParser: config?.urlParser ?? url_parser_dist_es/* parseUrl */.D,
        utf8Decoder: config?.utf8Decoder ?? dist_es_fromUtf8/* fromUtf8 */.a,
        utf8Encoder: config?.utf8Encoder ?? dist_es_toUtf8/* toUtf8 */.P,
    };
};

// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/defaults-mode.js
var defaults_mode = __webpack_require__(666);
// EXTERNAL MODULE: ./node_modules/@smithy/util-defaults-mode-node/dist-es/resolveDefaultsModeConfig.js + 2 modules
var resolveDefaultsModeConfig = __webpack_require__(1620);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js
var dist_es_emitWarningIfUnsupportedVersion = __webpack_require__(2339);
;// ./node_modules/@aws-sdk/client-lambda/dist-es/runtimeConfig.js
















const runtimeConfig_getRuntimeConfig = (config) => {
    (0,dist_es_emitWarningIfUnsupportedVersion/* emitWarningIfUnsupportedVersion */.I)(process.version);
    const defaultsMode = (0,resolveDefaultsModeConfig/* resolveDefaultsModeConfig */.I)(config);
    const defaultConfigProvider = () => defaultsMode().then(defaults_mode/* loadConfigsForDefaultMode */.l);
    const clientSharedValues = getRuntimeConfig(config);
    (0,emitWarningIfUnsupportedVersion/* emitWarningIfUnsupportedVersion */.I)(process.version);
    const loaderConfig = {
        profile: config?.profile,
        logger: clientSharedValues.logger,
    };
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        defaultsMode,
        authSchemePreference: config?.authSchemePreference ?? (0,configLoader/* loadConfig */.Z)(NODE_AUTH_SCHEME_PREFERENCE_OPTIONS/* NODE_AUTH_SCHEME_PREFERENCE_OPTIONS */.$, loaderConfig),
        bodyLengthChecker: config?.bodyLengthChecker ?? calculateBodyLength/* calculateBodyLength */.n,
        credentialDefaultProvider: config?.credentialDefaultProvider ?? defaultProvider,
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            (0,defaultUserAgent/* createDefaultUserAgentProvider */.pf)({ serviceId: clientSharedValues.serviceId, clientVersion: package_namespaceObject.rE }),
        eventStreamSerdeProvider: config?.eventStreamSerdeProvider ?? eventStreamSerdeProvider,
        maxAttempts: config?.maxAttempts ?? (0,configLoader/* loadConfig */.Z)(dist_es_configurations/* NODE_MAX_ATTEMPT_CONFIG_OPTIONS */.qs, config),
        region: config?.region ??
            (0,configLoader/* loadConfig */.Z)(regionConfig_config/* NODE_REGION_CONFIG_OPTIONS */.GG, { ...regionConfig_config/* NODE_REGION_CONFIG_FILE_OPTIONS */.zH, ...loaderConfig }),
        requestHandler: node_http_handler/* NodeHttpHandler */.$.create(config?.requestHandler ?? defaultConfigProvider),
        retryMode: config?.retryMode ??
            (0,configLoader/* loadConfig */.Z)({
                ...dist_es_configurations/* NODE_RETRY_MODE_CONFIG_OPTIONS */.kN,
                default: async () => (await defaultConfigProvider()).retryMode || dist_es_config/* DEFAULT_RETRY_MODE */.L0,
            }, config),
        sha256: config?.sha256 ?? hash_node_dist_es/* Hash */.V.bind(null, "sha256"),
        streamCollector: config?.streamCollector ?? stream_collector/* streamCollector */.k,
        useDualstackEndpoint: config?.useDualstackEndpoint ?? (0,configLoader/* loadConfig */.Z)(NodeUseDualstackEndpointConfigOptions/* NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS */.e$, loaderConfig),
        useFipsEndpoint: config?.useFipsEndpoint ?? (0,configLoader/* loadConfig */.Z)(NodeUseFipsEndpointConfigOptions/* NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS */.Ko, loaderConfig),
        userAgentAppId: config?.userAgentAppId ?? (0,configLoader/* loadConfig */.Z)(nodeAppIdConfigOptions/* NODE_APP_ID_CONFIG_OPTIONS */.hV, loaderConfig),
    };
};

// EXTERNAL MODULE: ./node_modules/@aws-sdk/region-config-resolver/dist-es/extensions/index.js
var dist_es_extensions = __webpack_require__(4163);
// EXTERNAL MODULE: ./node_modules/@smithy/protocol-http/dist-es/extensions/httpExtensionConfiguration.js
var httpExtensionConfiguration = __webpack_require__(2927);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/extensions/defaultExtensionConfiguration.js + 3 modules
var defaultExtensionConfiguration = __webpack_require__(9984);
;// ./node_modules/@aws-sdk/client-lambda/dist-es/auth/httpAuthExtensionConfiguration.js
const getHttpAuthExtensionConfiguration = (runtimeConfig) => {
    const _httpAuthSchemes = runtimeConfig.httpAuthSchemes;
    let _httpAuthSchemeProvider = runtimeConfig.httpAuthSchemeProvider;
    let _credentials = runtimeConfig.credentials;
    return {
        setHttpAuthScheme(httpAuthScheme) {
            const index = _httpAuthSchemes.findIndex((scheme) => scheme.schemeId === httpAuthScheme.schemeId);
            if (index === -1) {
                _httpAuthSchemes.push(httpAuthScheme);
            }
            else {
                _httpAuthSchemes.splice(index, 1, httpAuthScheme);
            }
        },
        httpAuthSchemes() {
            return _httpAuthSchemes;
        },
        setHttpAuthSchemeProvider(httpAuthSchemeProvider) {
            _httpAuthSchemeProvider = httpAuthSchemeProvider;
        },
        httpAuthSchemeProvider() {
            return _httpAuthSchemeProvider;
        },
        setCredentials(credentials) {
            _credentials = credentials;
        },
        credentials() {
            return _credentials;
        },
    };
};
const resolveHttpAuthRuntimeConfig = (config) => {
    return {
        httpAuthSchemes: config.httpAuthSchemes(),
        httpAuthSchemeProvider: config.httpAuthSchemeProvider(),
        credentials: config.credentials(),
    };
};

;// ./node_modules/@aws-sdk/client-lambda/dist-es/runtimeExtensions.js




const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
    const extensionConfiguration = Object.assign((0,dist_es_extensions/* getAwsRegionExtensionConfiguration */.R)(runtimeConfig), (0,defaultExtensionConfiguration/* getDefaultExtensionConfiguration */.xA)(runtimeConfig), (0,httpExtensionConfiguration/* getHttpHandlerExtensionConfiguration */.e)(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
    extensions.forEach((extension) => extension.configure(extensionConfiguration));
    return Object.assign(runtimeConfig, (0,dist_es_extensions/* resolveAwsRegionExtensionConfiguration */.$)(extensionConfiguration), (0,defaultExtensionConfiguration/* resolveDefaultRuntimeConfig */.uv)(extensionConfiguration), (0,httpExtensionConfiguration/* resolveHttpHandlerRuntimeConfig */.j)(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

;// ./node_modules/@aws-sdk/client-lambda/dist-es/LambdaClient.js
















class LambdaClient extends client/* Client */.K {
    config;
    constructor(...[configuration]) {
        const _config_0 = runtimeConfig_getRuntimeConfig(configuration || {});
        super(_config_0);
        this.initConfig = _config_0;
        const _config_1 = resolveClientEndpointParameters(_config_0);
        const _config_2 = (0,configurations/* resolveUserAgentConfig */.D)(_config_1);
        const _config_3 = (0,dist_es_configurations/* resolveRetryConfig */.$z)(_config_2);
        const _config_4 = (0,resolveRegionConfig/* resolveRegionConfig */.T)(_config_3);
        const _config_5 = (0,dist_es/* resolveHostHeaderConfig */.OV)(_config_4);
        const _config_6 = (0,resolveEndpointConfig/* resolveEndpointConfig */.C)(_config_5);
        const _config_7 = resolveEventStreamSerdeConfig(_config_6);
        const _config_8 = resolveHttpAuthSchemeConfig(_config_7);
        const _config_9 = resolveRuntimeExtensions(_config_8, configuration?.extensions || []);
        this.config = _config_9;
        this.middlewareStack.use((0,user_agent_middleware/* getUserAgentPlugin */.sM)(this.config));
        this.middlewareStack.use((0,retryMiddleware/* getRetryPlugin */.ey)(this.config));
        this.middlewareStack.use((0,middleware_content_length_dist_es/* getContentLengthPlugin */.vK)(this.config));
        this.middlewareStack.use((0,dist_es/* getHostHeaderPlugin */.TC)(this.config));
        this.middlewareStack.use((0,loggerMiddleware/* getLoggerPlugin */.Y7)(this.config));
        this.middlewareStack.use((0,getRecursionDetectionPlugin/* getRecursionDetectionPlugin */.n)(this.config));
        this.middlewareStack.use((0,getHttpAuthSchemeEndpointRuleSetPlugin/* getHttpAuthSchemeEndpointRuleSetPlugin */.w)(this.config, {
            httpAuthSchemeParametersProvider: defaultLambdaHttpAuthSchemeParametersProvider,
            identityProviderConfigProvider: async (config) => new DefaultIdentityProviderConfig/* DefaultIdentityProviderConfig */.h({
                "aws.auth#sigv4": config.credentials,
            }),
        }));
        this.middlewareStack.use((0,getHttpSigningMiddleware/* getHttpSigningPlugin */.l)(this.config));
    }
    destroy() {
        super.destroy();
    }
}

// EXTERNAL MODULE: ./node_modules/@smithy/middleware-endpoint/dist-es/getEndpointPlugin.js + 5 modules
var getEndpointPlugin = __webpack_require__(6768);
// EXTERNAL MODULE: ./node_modules/@smithy/middleware-serde/dist-es/serdePlugin.js + 2 modules
var serdePlugin = __webpack_require__(1698);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/command.js + 10 modules
var command = __webpack_require__(8603);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/constants.js
var constants = __webpack_require__(2809);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/exceptions.js
var exceptions = __webpack_require__(4384);
;// ./node_modules/@aws-sdk/client-lambda/dist-es/models/LambdaServiceException.js


class LambdaServiceException extends exceptions/* ServiceException */.T {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, LambdaServiceException.prototype);
    }
}

;// ./node_modules/@aws-sdk/client-lambda/dist-es/models/models_0.js


class InvalidParameterValueException extends LambdaServiceException {
    name = "InvalidParameterValueException";
    $fault = "client";
    Type;
    constructor(opts) {
        super({
            name: "InvalidParameterValueException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidParameterValueException.prototype);
        this.Type = opts.Type;
    }
}
class PolicyLengthExceededException extends LambdaServiceException {
    name = "PolicyLengthExceededException";
    $fault = "client";
    Type;
    constructor(opts) {
        super({
            name: "PolicyLengthExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, PolicyLengthExceededException.prototype);
        this.Type = opts.Type;
    }
}
class PreconditionFailedException extends LambdaServiceException {
    name = "PreconditionFailedException";
    $fault = "client";
    Type;
    constructor(opts) {
        super({
            name: "PreconditionFailedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, PreconditionFailedException.prototype);
        this.Type = opts.Type;
    }
}
class ResourceConflictException extends LambdaServiceException {
    name = "ResourceConflictException";
    $fault = "client";
    Type;
    constructor(opts) {
        super({
            name: "ResourceConflictException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceConflictException.prototype);
        this.Type = opts.Type;
    }
}
class ResourceNotFoundException extends LambdaServiceException {
    name = "ResourceNotFoundException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "ResourceNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class ServiceException extends LambdaServiceException {
    name = "ServiceException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "ServiceException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, ServiceException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
const ThrottleReason = {
    CallerRateLimitExceeded: "CallerRateLimitExceeded",
    ConcurrentInvocationLimitExceeded: "ConcurrentInvocationLimitExceeded",
    ConcurrentSnapshotCreateLimitExceeded: "ConcurrentSnapshotCreateLimitExceeded",
    FunctionInvocationRateLimitExceeded: "FunctionInvocationRateLimitExceeded",
    ReservedFunctionConcurrentInvocationLimitExceeded: "ReservedFunctionConcurrentInvocationLimitExceeded",
    ReservedFunctionInvocationRateLimitExceeded: "ReservedFunctionInvocationRateLimitExceeded",
};
class TooManyRequestsException extends LambdaServiceException {
    name = "TooManyRequestsException";
    $fault = "client";
    retryAfterSeconds;
    Type;
    Reason;
    constructor(opts) {
        super({
            name: "TooManyRequestsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, TooManyRequestsException.prototype);
        this.retryAfterSeconds = opts.retryAfterSeconds;
        this.Type = opts.Type;
        this.Reason = opts.Reason;
    }
}
const FunctionUrlAuthType = {
    AWS_IAM: "AWS_IAM",
    NONE: "NONE",
};
const KafkaSchemaRegistryAuthType = {
    BASIC_AUTH: "BASIC_AUTH",
    CLIENT_CERTIFICATE_TLS_AUTH: "CLIENT_CERTIFICATE_TLS_AUTH",
    SERVER_ROOT_CA_CERTIFICATE: "SERVER_ROOT_CA_CERTIFICATE",
};
const SchemaRegistryEventRecordFormat = {
    JSON: "JSON",
    SOURCE: "SOURCE",
};
const KafkaSchemaValidationAttribute = {
    KEY: "KEY",
    VALUE: "VALUE",
};
const ApplicationLogLevel = {
    Debug: "DEBUG",
    Error: "ERROR",
    Fatal: "FATAL",
    Info: "INFO",
    Trace: "TRACE",
    Warn: "WARN",
};
const Architecture = {
    arm64: "arm64",
    x86_64: "x86_64",
};
const CodeSigningPolicy = {
    Enforce: "Enforce",
    Warn: "Warn",
};
const FullDocument = {
    Default: "Default",
    UpdateLookup: "UpdateLookup",
};
const FunctionResponseType = {
    ReportBatchItemFailures: "ReportBatchItemFailures",
};
const EventSourceMappingMetric = {
    EventCount: "EventCount",
};
const EndPointType = {
    KAFKA_BOOTSTRAP_SERVERS: "KAFKA_BOOTSTRAP_SERVERS",
};
const SourceAccessType = {
    BASIC_AUTH: "BASIC_AUTH",
    CLIENT_CERTIFICATE_TLS_AUTH: "CLIENT_CERTIFICATE_TLS_AUTH",
    SASL_SCRAM_256_AUTH: "SASL_SCRAM_256_AUTH",
    SASL_SCRAM_512_AUTH: "SASL_SCRAM_512_AUTH",
    SERVER_ROOT_CA_CERTIFICATE: "SERVER_ROOT_CA_CERTIFICATE",
    VIRTUAL_HOST: "VIRTUAL_HOST",
    VPC_SECURITY_GROUP: "VPC_SECURITY_GROUP",
    VPC_SUBNET: "VPC_SUBNET",
};
const EventSourcePosition = {
    AT_TIMESTAMP: "AT_TIMESTAMP",
    LATEST: "LATEST",
    TRIM_HORIZON: "TRIM_HORIZON",
};
class ResourceInUseException extends LambdaServiceException {
    name = "ResourceInUseException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "ResourceInUseException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceInUseException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class CodeSigningConfigNotFoundException extends LambdaServiceException {
    name = "CodeSigningConfigNotFoundException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "CodeSigningConfigNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, CodeSigningConfigNotFoundException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class CodeStorageExceededException extends LambdaServiceException {
    name = "CodeStorageExceededException";
    $fault = "client";
    Type;
    constructor(opts) {
        super({
            name: "CodeStorageExceededException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, CodeStorageExceededException.prototype);
        this.Type = opts.Type;
    }
}
class CodeVerificationFailedException extends LambdaServiceException {
    name = "CodeVerificationFailedException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "CodeVerificationFailedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, CodeVerificationFailedException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
const LogFormat = {
    Json: "JSON",
    Text: "Text",
};
const SystemLogLevel = {
    Debug: "DEBUG",
    Info: "INFO",
    Warn: "WARN",
};
const PackageType = {
    Image: "Image",
    Zip: "Zip",
};
const Runtime = {
    dotnet6: "dotnet6",
    dotnet8: "dotnet8",
    dotnetcore10: "dotnetcore1.0",
    dotnetcore20: "dotnetcore2.0",
    dotnetcore21: "dotnetcore2.1",
    dotnetcore31: "dotnetcore3.1",
    go1x: "go1.x",
    java11: "java11",
    java17: "java17",
    java21: "java21",
    java8: "java8",
    java8al2: "java8.al2",
    nodejs: "nodejs",
    nodejs10x: "nodejs10.x",
    nodejs12x: "nodejs12.x",
    nodejs14x: "nodejs14.x",
    nodejs16x: "nodejs16.x",
    nodejs18x: "nodejs18.x",
    nodejs20x: "nodejs20.x",
    nodejs22x: "nodejs22.x",
    nodejs43: "nodejs4.3",
    nodejs43edge: "nodejs4.3-edge",
    nodejs610: "nodejs6.10",
    nodejs810: "nodejs8.10",
    provided: "provided",
    providedal2: "provided.al2",
    providedal2023: "provided.al2023",
    python27: "python2.7",
    python310: "python3.10",
    python311: "python3.11",
    python312: "python3.12",
    python313: "python3.13",
    python36: "python3.6",
    python37: "python3.7",
    python38: "python3.8",
    python39: "python3.9",
    ruby25: "ruby2.5",
    ruby27: "ruby2.7",
    ruby32: "ruby3.2",
    ruby33: "ruby3.3",
    ruby34: "ruby3.4",
};
const SnapStartApplyOn = {
    None: "None",
    PublishedVersions: "PublishedVersions",
};
const TracingMode = {
    Active: "Active",
    PassThrough: "PassThrough",
};
const LastUpdateStatus = {
    Failed: "Failed",
    InProgress: "InProgress",
    Successful: "Successful",
};
const LastUpdateStatusReasonCode = {
    DisabledKMSKey: "DisabledKMSKey",
    EFSIOError: "EFSIOError",
    EFSMountConnectivityError: "EFSMountConnectivityError",
    EFSMountFailure: "EFSMountFailure",
    EFSMountTimeout: "EFSMountTimeout",
    EniLimitExceeded: "EniLimitExceeded",
    FunctionError: "FunctionError",
    ImageAccessDenied: "ImageAccessDenied",
    ImageDeleted: "ImageDeleted",
    InsufficientRolePermissions: "InsufficientRolePermissions",
    InternalError: "InternalError",
    InvalidConfiguration: "InvalidConfiguration",
    InvalidImage: "InvalidImage",
    InvalidRuntime: "InvalidRuntime",
    InvalidSecurityGroup: "InvalidSecurityGroup",
    InvalidStateKMSKey: "InvalidStateKMSKey",
    InvalidSubnet: "InvalidSubnet",
    InvalidZipFileException: "InvalidZipFileException",
    KMSKeyAccessDenied: "KMSKeyAccessDenied",
    KMSKeyNotFound: "KMSKeyNotFound",
    SubnetOutOfIPAddresses: "SubnetOutOfIPAddresses",
};
const SnapStartOptimizationStatus = {
    Off: "Off",
    On: "On",
};
const State = {
    Active: "Active",
    Failed: "Failed",
    Inactive: "Inactive",
    Pending: "Pending",
};
const StateReasonCode = {
    Creating: "Creating",
    DisabledKMSKey: "DisabledKMSKey",
    EFSIOError: "EFSIOError",
    EFSMountConnectivityError: "EFSMountConnectivityError",
    EFSMountFailure: "EFSMountFailure",
    EFSMountTimeout: "EFSMountTimeout",
    EniLimitExceeded: "EniLimitExceeded",
    FunctionError: "FunctionError",
    Idle: "Idle",
    ImageAccessDenied: "ImageAccessDenied",
    ImageDeleted: "ImageDeleted",
    InsufficientRolePermissions: "InsufficientRolePermissions",
    InternalError: "InternalError",
    InvalidConfiguration: "InvalidConfiguration",
    InvalidImage: "InvalidImage",
    InvalidRuntime: "InvalidRuntime",
    InvalidSecurityGroup: "InvalidSecurityGroup",
    InvalidStateKMSKey: "InvalidStateKMSKey",
    InvalidSubnet: "InvalidSubnet",
    InvalidZipFileException: "InvalidZipFileException",
    KMSKeyAccessDenied: "KMSKeyAccessDenied",
    KMSKeyNotFound: "KMSKeyNotFound",
    Restoring: "Restoring",
    SubnetOutOfIPAddresses: "SubnetOutOfIPAddresses",
};
class InvalidCodeSignatureException extends LambdaServiceException {
    name = "InvalidCodeSignatureException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "InvalidCodeSignatureException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidCodeSignatureException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
const InvokeMode = {
    BUFFERED: "BUFFERED",
    RESPONSE_STREAM: "RESPONSE_STREAM",
};
const RecursiveLoop = {
    Allow: "Allow",
    Terminate: "Terminate",
};
const UpdateRuntimeOn = {
    Auto: "Auto",
    FunctionUpdate: "FunctionUpdate",
    Manual: "Manual",
};
class EC2AccessDeniedException extends LambdaServiceException {
    name = "EC2AccessDeniedException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "EC2AccessDeniedException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, EC2AccessDeniedException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class EC2ThrottledException extends LambdaServiceException {
    name = "EC2ThrottledException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "EC2ThrottledException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, EC2ThrottledException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class EC2UnexpectedException extends LambdaServiceException {
    name = "EC2UnexpectedException";
    $fault = "server";
    Type;
    Message;
    EC2ErrorCode;
    constructor(opts) {
        super({
            name: "EC2UnexpectedException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, EC2UnexpectedException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
        this.EC2ErrorCode = opts.EC2ErrorCode;
    }
}
class EFSIOException extends LambdaServiceException {
    name = "EFSIOException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "EFSIOException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, EFSIOException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class EFSMountConnectivityException extends LambdaServiceException {
    name = "EFSMountConnectivityException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "EFSMountConnectivityException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, EFSMountConnectivityException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class EFSMountFailureException extends LambdaServiceException {
    name = "EFSMountFailureException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "EFSMountFailureException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, EFSMountFailureException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class EFSMountTimeoutException extends LambdaServiceException {
    name = "EFSMountTimeoutException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "EFSMountTimeoutException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, EFSMountTimeoutException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class ENILimitReachedException extends LambdaServiceException {
    name = "ENILimitReachedException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "ENILimitReachedException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, ENILimitReachedException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class InvalidRequestContentException extends LambdaServiceException {
    name = "InvalidRequestContentException";
    $fault = "client";
    Type;
    constructor(opts) {
        super({
            name: "InvalidRequestContentException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidRequestContentException.prototype);
        this.Type = opts.Type;
    }
}
class InvalidRuntimeException extends LambdaServiceException {
    name = "InvalidRuntimeException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "InvalidRuntimeException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidRuntimeException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class InvalidSecurityGroupIDException extends LambdaServiceException {
    name = "InvalidSecurityGroupIDException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "InvalidSecurityGroupIDException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidSecurityGroupIDException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class InvalidSubnetIDException extends LambdaServiceException {
    name = "InvalidSubnetIDException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "InvalidSubnetIDException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidSubnetIDException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class InvalidZipFileException extends LambdaServiceException {
    name = "InvalidZipFileException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "InvalidZipFileException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidZipFileException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
const InvocationType = {
    DryRun: "DryRun",
    Event: "Event",
    RequestResponse: "RequestResponse",
};
const LogType = {
    None: "None",
    Tail: "Tail",
};
class KMSAccessDeniedException extends LambdaServiceException {
    name = "KMSAccessDeniedException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "KMSAccessDeniedException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, KMSAccessDeniedException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class KMSDisabledException extends LambdaServiceException {
    name = "KMSDisabledException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "KMSDisabledException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, KMSDisabledException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class KMSInvalidStateException extends LambdaServiceException {
    name = "KMSInvalidStateException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "KMSInvalidStateException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, KMSInvalidStateException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class KMSNotFoundException extends LambdaServiceException {
    name = "KMSNotFoundException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "KMSNotFoundException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, KMSNotFoundException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class RecursiveInvocationException extends LambdaServiceException {
    name = "RecursiveInvocationException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "RecursiveInvocationException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, RecursiveInvocationException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class RequestTooLargeException extends LambdaServiceException {
    name = "RequestTooLargeException";
    $fault = "client";
    Type;
    constructor(opts) {
        super({
            name: "RequestTooLargeException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, RequestTooLargeException.prototype);
        this.Type = opts.Type;
    }
}
class ResourceNotReadyException extends LambdaServiceException {
    name = "ResourceNotReadyException";
    $fault = "server";
    Type;
    constructor(opts) {
        super({
            name: "ResourceNotReadyException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceNotReadyException.prototype);
        this.Type = opts.Type;
    }
}
class SnapStartException extends LambdaServiceException {
    name = "SnapStartException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "SnapStartException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, SnapStartException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class SnapStartNotReadyException extends LambdaServiceException {
    name = "SnapStartNotReadyException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "SnapStartNotReadyException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, SnapStartNotReadyException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class SnapStartTimeoutException extends LambdaServiceException {
    name = "SnapStartTimeoutException";
    $fault = "client";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "SnapStartTimeoutException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, SnapStartTimeoutException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class SubnetIPAddressLimitReachedException extends LambdaServiceException {
    name = "SubnetIPAddressLimitReachedException";
    $fault = "server";
    Type;
    Message;
    constructor(opts) {
        super({
            name: "SubnetIPAddressLimitReachedException",
            $fault: "server",
            ...opts,
        });
        Object.setPrototypeOf(this, SubnetIPAddressLimitReachedException.prototype);
        this.Type = opts.Type;
        this.Message = opts.Message;
    }
}
class UnsupportedMediaTypeException extends LambdaServiceException {
    name = "UnsupportedMediaTypeException";
    $fault = "client";
    Type;
    constructor(opts) {
        super({
            name: "UnsupportedMediaTypeException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, UnsupportedMediaTypeException.prototype);
        this.Type = opts.Type;
    }
}
const ResponseStreamingInvocationType = {
    DryRun: "DryRun",
    RequestResponse: "RequestResponse",
};
var InvokeWithResponseStreamResponseEvent;
(function (InvokeWithResponseStreamResponseEvent) {
    InvokeWithResponseStreamResponseEvent.visit = (value, visitor) => {
        if (value.PayloadChunk !== undefined)
            return visitor.PayloadChunk(value.PayloadChunk);
        if (value.InvokeComplete !== undefined)
            return visitor.InvokeComplete(value.InvokeComplete);
        return visitor._(value.$unknown[0], value.$unknown[1]);
    };
})(InvokeWithResponseStreamResponseEvent || (InvokeWithResponseStreamResponseEvent = {}));
const FunctionVersion = {
    ALL: "ALL",
};
const ProvisionedConcurrencyStatusEnum = {
    FAILED: "FAILED",
    IN_PROGRESS: "IN_PROGRESS",
    READY: "READY",
};
class ProvisionedConcurrencyConfigNotFoundException extends LambdaServiceException {
    name = "ProvisionedConcurrencyConfigNotFoundException";
    $fault = "client";
    Type;
    constructor(opts) {
        super({
            name: "ProvisionedConcurrencyConfigNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ProvisionedConcurrencyConfigNotFoundException.prototype);
        this.Type = opts.Type;
    }
}
const FunctionCodeFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.ZipFile && { ZipFile: SENSITIVE_STRING }),
});
const EnvironmentFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Variables && { Variables: SENSITIVE_STRING }),
});
const CreateFunctionRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Code && { Code: FunctionCodeFilterSensitiveLog(obj.Code) }),
    ...(obj.Environment && { Environment: EnvironmentFilterSensitiveLog(obj.Environment) }),
});
const EnvironmentErrorFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Message && { Message: SENSITIVE_STRING }),
});
const EnvironmentResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Variables && { Variables: SENSITIVE_STRING }),
    ...(obj.Error && { Error: EnvironmentErrorFilterSensitiveLog(obj.Error) }),
});
const ImageConfigErrorFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Message && { Message: SENSITIVE_STRING }),
});
const ImageConfigResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Error && { Error: ImageConfigErrorFilterSensitiveLog(obj.Error) }),
});
const RuntimeVersionErrorFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Message && { Message: SENSITIVE_STRING }),
});
const RuntimeVersionConfigFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Error && { Error: RuntimeVersionErrorFilterSensitiveLog(obj.Error) }),
});
const FunctionConfigurationFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Environment && { Environment: EnvironmentResponseFilterSensitiveLog(obj.Environment) }),
    ...(obj.ImageConfigResponse && {
        ImageConfigResponse: ImageConfigResponseFilterSensitiveLog(obj.ImageConfigResponse),
    }),
    ...(obj.RuntimeVersionConfig && {
        RuntimeVersionConfig: RuntimeVersionConfigFilterSensitiveLog(obj.RuntimeVersionConfig),
    }),
});
const GetFunctionResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Configuration && { Configuration: FunctionConfigurationFilterSensitiveLog(obj.Configuration) }),
});
const InvocationRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Payload && { Payload: constants/* SENSITIVE_STRING */.$ }),
});
const InvocationResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Payload && { Payload: constants/* SENSITIVE_STRING */.$ }),
});
const InvokeAsyncRequestFilterSensitiveLog = (obj) => ({
    ...obj,
});
const InvokeWithResponseStreamRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Payload && { Payload: SENSITIVE_STRING }),
});
const InvokeResponseStreamUpdateFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Payload && { Payload: SENSITIVE_STRING }),
});
const InvokeWithResponseStreamResponseEventFilterSensitiveLog = (obj) => {
    if (obj.PayloadChunk !== undefined)
        return { PayloadChunk: InvokeResponseStreamUpdateFilterSensitiveLog(obj.PayloadChunk) };
    if (obj.InvokeComplete !== undefined)
        return { InvokeComplete: obj.InvokeComplete };
    if (obj.$unknown !== undefined)
        return { [obj.$unknown[0]]: "UNKNOWN" };
};
const InvokeWithResponseStreamResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.EventStream && { EventStream: "STREAMING_CONTENT" }),
});
const ListFunctionsResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Functions && { Functions: obj.Functions.map((item) => FunctionConfigurationFilterSensitiveLog(item)) }),
});
const UpdateFunctionCodeRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.ZipFile && { ZipFile: SENSITIVE_STRING }),
});
const UpdateFunctionConfigurationRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Environment && { Environment: EnvironmentFilterSensitiveLog(obj.Environment) }),
});
const ListVersionsByFunctionResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Versions && { Versions: obj.Versions.map((item) => FunctionConfigurationFilterSensitiveLog(item)) }),
});
const LayerVersionContentInputFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.ZipFile && { ZipFile: SENSITIVE_STRING }),
});
const PublishLayerVersionRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.Content && { Content: LayerVersionContentInputFilterSensitiveLog(obj.Content) }),
});

// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/parseJsonBody.js
var parseJsonBody = __webpack_require__(1919);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/submodules/protocols/requestBuilder.js + 1 modules
var requestBuilder = __webpack_require__(9212);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/object-mapping.js
var object_mapping = __webpack_require__(1226);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/is-serializable-header-value.js
var is_serializable_header_value = __webpack_require__(212);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/submodules/protocols/collect-stream-body.js + 2 modules
var collect_stream_body = __webpack_require__(1071);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/default-error-handler.js
var default_error_handler = __webpack_require__(2967);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/submodules/serde/parse-utils.js
var parse_utils = __webpack_require__(6460);
;// ./node_modules/@aws-sdk/client-lambda/dist-es/protocols/Aws_restJson1.js





const se_AddLayerVersionPermissionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy");
    b.p("LayerName", () => input.LayerName, "{LayerName}", false);
    b.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
    const query = map({
        [_RI]: [, input[_RI]],
    });
    let body;
    body = JSON.stringify(take(input, {
        Action: [],
        OrganizationId: [],
        Principal: [],
        StatementId: [],
    }));
    b.m("POST").h(headers).q(query).b(body);
    return b.build();
};
const se_AddPermissionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2015-03-31/functions/{FunctionName}/policy");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    body = JSON.stringify(take(input, {
        Action: [],
        EventSourceToken: [],
        FunctionUrlAuthType: [],
        Principal: [],
        PrincipalOrgID: [],
        RevisionId: [],
        SourceAccount: [],
        SourceArn: [],
        StatementId: [],
    }));
    b.m("POST").h(headers).q(query).b(body);
    return b.build();
};
const se_CreateAliasCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2015-03-31/functions/{FunctionName}/aliases");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    body = JSON.stringify(take(input, {
        Description: [],
        FunctionVersion: [],
        Name: [],
        RoutingConfig: (_) => se_AliasRoutingConfiguration(_, context),
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
const se_CreateCodeSigningConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2020-04-22/code-signing-configs");
    let body;
    body = JSON.stringify(take(input, {
        AllowedPublishers: (_) => _json(_),
        CodeSigningPolicies: (_) => _json(_),
        Description: [],
        Tags: (_) => _json(_),
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
const se_CreateEventSourceMappingCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2015-03-31/event-source-mappings");
    let body;
    body = JSON.stringify(take(input, {
        AmazonManagedKafkaEventSourceConfig: (_) => _json(_),
        BatchSize: [],
        BisectBatchOnFunctionError: [],
        DestinationConfig: (_) => _json(_),
        DocumentDBEventSourceConfig: (_) => _json(_),
        Enabled: [],
        EventSourceArn: [],
        FilterCriteria: (_) => _json(_),
        FunctionName: [],
        FunctionResponseTypes: (_) => _json(_),
        KMSKeyArn: [],
        MaximumBatchingWindowInSeconds: [],
        MaximumRecordAgeInSeconds: [],
        MaximumRetryAttempts: [],
        MetricsConfig: (_) => _json(_),
        ParallelizationFactor: [],
        ProvisionedPollerConfig: (_) => _json(_),
        Queues: (_) => _json(_),
        ScalingConfig: (_) => _json(_),
        SelfManagedEventSource: (_) => _json(_),
        SelfManagedKafkaEventSourceConfig: (_) => _json(_),
        SourceAccessConfigurations: (_) => _json(_),
        StartingPosition: [],
        StartingPositionTimestamp: (_) => _.getTime() / 1_000,
        Tags: (_) => _json(_),
        Topics: (_) => _json(_),
        TumblingWindowInSeconds: [],
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
const se_CreateFunctionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2015-03-31/functions");
    let body;
    body = JSON.stringify(take(input, {
        Architectures: (_) => _json(_),
        Code: (_) => se_FunctionCode(_, context),
        CodeSigningConfigArn: [],
        DeadLetterConfig: (_) => _json(_),
        Description: [],
        Environment: (_) => _json(_),
        EphemeralStorage: (_) => _json(_),
        FileSystemConfigs: (_) => _json(_),
        FunctionName: [],
        Handler: [],
        ImageConfig: (_) => _json(_),
        KMSKeyArn: [],
        Layers: (_) => _json(_),
        LoggingConfig: (_) => _json(_),
        MemorySize: [],
        PackageType: [],
        Publish: [],
        Role: [],
        Runtime: [],
        SnapStart: (_) => _json(_),
        Tags: (_) => _json(_),
        Timeout: [],
        TracingConfig: (_) => _json(_),
        VpcConfig: (_) => _json(_),
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
const se_CreateFunctionUrlConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2021-10-31/functions/{FunctionName}/url");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    body = JSON.stringify(take(input, {
        AuthType: [],
        Cors: (_) => _json(_),
        InvokeMode: [],
    }));
    b.m("POST").h(headers).q(query).b(body);
    return b.build();
};
const se_DeleteAliasCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions/{FunctionName}/aliases/{Name}");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    b.p("Name", () => input.Name, "{Name}", false);
    let body;
    b.m("DELETE").h(headers).b(body);
    return b.build();
};
const se_DeleteCodeSigningConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}");
    b.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
    let body;
    b.m("DELETE").h(headers).b(body);
    return b.build();
};
const se_DeleteEventSourceMappingCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/event-source-mappings/{UUID}");
    b.p("UUID", () => input.UUID, "{UUID}", false);
    let body;
    b.m("DELETE").h(headers).b(body);
    return b.build();
};
const se_DeleteFunctionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions/{FunctionName}");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    b.m("DELETE").h(headers).q(query).b(body);
    return b.build();
};
const se_DeleteFunctionCodeSigningConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2020-06-30/functions/{FunctionName}/code-signing-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    b.m("DELETE").h(headers).b(body);
    return b.build();
};
const se_DeleteFunctionConcurrencyCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2017-10-31/functions/{FunctionName}/concurrency");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    b.m("DELETE").h(headers).b(body);
    return b.build();
};
const se_DeleteFunctionEventInvokeConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    b.m("DELETE").h(headers).q(query).b(body);
    return b.build();
};
const se_DeleteFunctionUrlConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2021-10-31/functions/{FunctionName}/url");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    b.m("DELETE").h(headers).q(query).b(body);
    return b.build();
};
const se_DeleteLayerVersionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}");
    b.p("LayerName", () => input.LayerName, "{LayerName}", false);
    b.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
    let body;
    b.m("DELETE").h(headers).b(body);
    return b.build();
};
const se_DeleteProvisionedConcurrencyConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, __expectNonNull(input[_Q], `Qualifier`)],
    });
    let body;
    b.m("DELETE").h(headers).q(query).b(body);
    return b.build();
};
const se_GetAccountSettingsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2016-08-19/account-settings");
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_GetAliasCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions/{FunctionName}/aliases/{Name}");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    b.p("Name", () => input.Name, "{Name}", false);
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_GetCodeSigningConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}");
    b.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_GetEventSourceMappingCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/event-source-mappings/{UUID}");
    b.p("UUID", () => input.UUID, "{UUID}", false);
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_GetFunctionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions/{FunctionName}");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_GetFunctionCodeSigningConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2020-06-30/functions/{FunctionName}/code-signing-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_GetFunctionConcurrencyCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2019-09-30/functions/{FunctionName}/concurrency");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_GetFunctionConfigurationCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions/{FunctionName}/configuration");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_GetFunctionEventInvokeConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_GetFunctionRecursionConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2024-08-31/functions/{FunctionName}/recursion-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_GetFunctionUrlConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2021-10-31/functions/{FunctionName}/url");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_GetLayerVersionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}");
    b.p("LayerName", () => input.LayerName, "{LayerName}", false);
    b.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_GetLayerVersionByArnCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2018-10-31/layers");
    const query = map({
        [_f]: [, "LayerVersion"],
        [_A]: [, __expectNonNull(input[_A], `Arn`)],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_GetLayerVersionPolicyCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy");
    b.p("LayerName", () => input.LayerName, "{LayerName}", false);
    b.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_GetPolicyCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions/{FunctionName}/policy");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_GetProvisionedConcurrencyConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, __expectNonNull(input[_Q], `Qualifier`)],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_GetRuntimeManagementConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2021-07-20/functions/{FunctionName}/runtime-management-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_InvokeCommand = async (input, context) => {
    const b = (0,requestBuilder/* requestBuilder */.l)(input, context);
    const headers = (0,object_mapping/* map */.Tj)({}, is_serializable_header_value/* isSerializableHeaderValue */.e, {
        "content-type": "application/octet-stream",
        [_xait]: input[_IT],
        [_xalt]: input[_LT],
        [_xacc]: input[_CC],
    });
    b.bp("/2015-03-31/functions/{FunctionName}/invocations");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = (0,object_mapping/* map */.Tj)({
        [_Q]: [, input[_Q]],
    });
    let body;
    if (input.Payload !== undefined) {
        body = input.Payload;
    }
    b.m("POST").h(headers).q(query).b(body);
    return b.build();
};
const se_InvokeAsyncCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/octet-stream",
    };
    b.bp("/2014-11-13/functions/{FunctionName}/invoke-async");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    if (input.InvokeArgs !== undefined) {
        body = input.InvokeArgs;
    }
    b.m("POST").h(headers).b(body);
    return b.build();
};
const se_InvokeWithResponseStreamCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = map({}, isSerializableHeaderValue, {
        "content-type": "application/octet-stream",
        [_xait]: input[_IT],
        [_xalt]: input[_LT],
        [_xacc]: input[_CC],
    });
    b.bp("/2021-11-15/functions/{FunctionName}/response-streaming-invocations");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    if (input.Payload !== undefined) {
        body = input.Payload;
    }
    b.m("POST").h(headers).q(query).b(body);
    return b.build();
};
const se_ListAliasesCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions/{FunctionName}/aliases");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_FV]: [, input[_FV]],
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListCodeSigningConfigsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2020-04-22/code-signing-configs");
    const query = map({
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListEventSourceMappingsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/event-source-mappings");
    const query = map({
        [_ESA]: [, input[_ESA]],
        [_FN]: [, input[_FN]],
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListFunctionEventInvokeConfigsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config/list");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListFunctionsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions");
    const query = map({
        [_MR]: [, input[_MR]],
        [_FV]: [, input[_FV]],
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListFunctionsByCodeSigningConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}/functions");
    b.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
    const query = map({
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListFunctionUrlConfigsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2021-10-31/functions/{FunctionName}/urls");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListLayersCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2018-10-31/layers");
    const query = map({
        [_CR]: [, input[_CR]],
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
        [_CA]: [, input[_CA]],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListLayerVersionsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2018-10-31/layers/{LayerName}/versions");
    b.p("LayerName", () => input.LayerName, "{LayerName}", false);
    const query = map({
        [_CR]: [, input[_CR]],
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
        [_CA]: [, input[_CA]],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListProvisionedConcurrencyConfigsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_L]: [, "ALL"],
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListTagsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2017-03-31/tags/{Resource}");
    b.p("Resource", () => input.Resource, "{Resource}", false);
    let body;
    b.m("GET").h(headers).b(body);
    return b.build();
};
const se_ListVersionsByFunctionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions/{FunctionName}/versions");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_M]: [, input[_M]],
        [_MI]: [() => input.MaxItems !== void 0, () => input[_MI].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_PublishLayerVersionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2018-10-31/layers/{LayerName}/versions");
    b.p("LayerName", () => input.LayerName, "{LayerName}", false);
    let body;
    body = JSON.stringify(take(input, {
        CompatibleArchitectures: (_) => _json(_),
        CompatibleRuntimes: (_) => _json(_),
        Content: (_) => se_LayerVersionContentInput(_, context),
        Description: [],
        LicenseInfo: [],
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
const se_PublishVersionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2015-03-31/functions/{FunctionName}/versions");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    body = JSON.stringify(take(input, {
        CodeSha256: [],
        Description: [],
        RevisionId: [],
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
const se_PutFunctionCodeSigningConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2020-06-30/functions/{FunctionName}/code-signing-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    body = JSON.stringify(take(input, {
        CodeSigningConfigArn: [],
    }));
    b.m("PUT").h(headers).b(body);
    return b.build();
};
const se_PutFunctionConcurrencyCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2017-10-31/functions/{FunctionName}/concurrency");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    body = JSON.stringify(take(input, {
        ReservedConcurrentExecutions: [],
    }));
    b.m("PUT").h(headers).b(body);
    return b.build();
};
const se_PutFunctionEventInvokeConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    body = JSON.stringify(take(input, {
        DestinationConfig: (_) => _json(_),
        MaximumEventAgeInSeconds: [],
        MaximumRetryAttempts: [],
    }));
    b.m("PUT").h(headers).q(query).b(body);
    return b.build();
};
const se_PutFunctionRecursionConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2024-08-31/functions/{FunctionName}/recursion-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    body = JSON.stringify(take(input, {
        RecursiveLoop: [],
    }));
    b.m("PUT").h(headers).b(body);
    return b.build();
};
const se_PutProvisionedConcurrencyConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2019-09-30/functions/{FunctionName}/provisioned-concurrency");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, __expectNonNull(input[_Q], `Qualifier`)],
    });
    let body;
    body = JSON.stringify(take(input, {
        ProvisionedConcurrentExecutions: [],
    }));
    b.m("PUT").h(headers).q(query).b(body);
    return b.build();
};
const se_PutRuntimeManagementConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2021-07-20/functions/{FunctionName}/runtime-management-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    body = JSON.stringify(take(input, {
        RuntimeVersionArn: [],
        UpdateRuntimeOn: [],
    }));
    b.m("PUT").h(headers).q(query).b(body);
    return b.build();
};
const se_RemoveLayerVersionPermissionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2018-10-31/layers/{LayerName}/versions/{VersionNumber}/policy/{StatementId}");
    b.p("LayerName", () => input.LayerName, "{LayerName}", false);
    b.p("VersionNumber", () => input.VersionNumber.toString(), "{VersionNumber}", false);
    b.p("StatementId", () => input.StatementId, "{StatementId}", false);
    const query = map({
        [_RI]: [, input[_RI]],
    });
    let body;
    b.m("DELETE").h(headers).q(query).b(body);
    return b.build();
};
const se_RemovePermissionCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2015-03-31/functions/{FunctionName}/policy/{StatementId}");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    b.p("StatementId", () => input.StatementId, "{StatementId}", false);
    const query = map({
        [_Q]: [, input[_Q]],
        [_RI]: [, input[_RI]],
    });
    let body;
    b.m("DELETE").h(headers).q(query).b(body);
    return b.build();
};
const se_TagResourceCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2017-03-31/tags/{Resource}");
    b.p("Resource", () => input.Resource, "{Resource}", false);
    let body;
    body = JSON.stringify(take(input, {
        Tags: (_) => _json(_),
    }));
    b.m("POST").h(headers).b(body);
    return b.build();
};
const se_UntagResourceCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {};
    b.bp("/2017-03-31/tags/{Resource}");
    b.p("Resource", () => input.Resource, "{Resource}", false);
    const query = map({
        [_tK]: [__expectNonNull(input.TagKeys, `TagKeys`) != null, () => input[_TK] || []],
    });
    let body;
    b.m("DELETE").h(headers).q(query).b(body);
    return b.build();
};
const se_UpdateAliasCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2015-03-31/functions/{FunctionName}/aliases/{Name}");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    b.p("Name", () => input.Name, "{Name}", false);
    let body;
    body = JSON.stringify(take(input, {
        Description: [],
        FunctionVersion: [],
        RevisionId: [],
        RoutingConfig: (_) => se_AliasRoutingConfiguration(_, context),
    }));
    b.m("PUT").h(headers).b(body);
    return b.build();
};
const se_UpdateCodeSigningConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2020-04-22/code-signing-configs/{CodeSigningConfigArn}");
    b.p("CodeSigningConfigArn", () => input.CodeSigningConfigArn, "{CodeSigningConfigArn}", false);
    let body;
    body = JSON.stringify(take(input, {
        AllowedPublishers: (_) => _json(_),
        CodeSigningPolicies: (_) => _json(_),
        Description: [],
    }));
    b.m("PUT").h(headers).b(body);
    return b.build();
};
const se_UpdateEventSourceMappingCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2015-03-31/event-source-mappings/{UUID}");
    b.p("UUID", () => input.UUID, "{UUID}", false);
    let body;
    body = JSON.stringify(take(input, {
        AmazonManagedKafkaEventSourceConfig: (_) => _json(_),
        BatchSize: [],
        BisectBatchOnFunctionError: [],
        DestinationConfig: (_) => _json(_),
        DocumentDBEventSourceConfig: (_) => _json(_),
        Enabled: [],
        FilterCriteria: (_) => _json(_),
        FunctionName: [],
        FunctionResponseTypes: (_) => _json(_),
        KMSKeyArn: [],
        MaximumBatchingWindowInSeconds: [],
        MaximumRecordAgeInSeconds: [],
        MaximumRetryAttempts: [],
        MetricsConfig: (_) => _json(_),
        ParallelizationFactor: [],
        ProvisionedPollerConfig: (_) => _json(_),
        ScalingConfig: (_) => _json(_),
        SelfManagedKafkaEventSourceConfig: (_) => _json(_),
        SourceAccessConfigurations: (_) => _json(_),
        TumblingWindowInSeconds: [],
    }));
    b.m("PUT").h(headers).b(body);
    return b.build();
};
const se_UpdateFunctionCodeCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2015-03-31/functions/{FunctionName}/code");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    body = JSON.stringify(take(input, {
        Architectures: (_) => _json(_),
        DryRun: [],
        ImageUri: [],
        Publish: [],
        RevisionId: [],
        S3Bucket: [],
        S3Key: [],
        S3ObjectVersion: [],
        SourceKMSKeyArn: [],
        ZipFile: (_) => context.base64Encoder(_),
    }));
    b.m("PUT").h(headers).b(body);
    return b.build();
};
const se_UpdateFunctionConfigurationCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2015-03-31/functions/{FunctionName}/configuration");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    let body;
    body = JSON.stringify(take(input, {
        DeadLetterConfig: (_) => _json(_),
        Description: [],
        Environment: (_) => _json(_),
        EphemeralStorage: (_) => _json(_),
        FileSystemConfigs: (_) => _json(_),
        Handler: [],
        ImageConfig: (_) => _json(_),
        KMSKeyArn: [],
        Layers: (_) => _json(_),
        LoggingConfig: (_) => _json(_),
        MemorySize: [],
        RevisionId: [],
        Role: [],
        Runtime: [],
        SnapStart: (_) => _json(_),
        Timeout: [],
        TracingConfig: (_) => _json(_),
        VpcConfig: (_) => _json(_),
    }));
    b.m("PUT").h(headers).b(body);
    return b.build();
};
const se_UpdateFunctionEventInvokeConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2019-09-25/functions/{FunctionName}/event-invoke-config");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    body = JSON.stringify(take(input, {
        DestinationConfig: (_) => _json(_),
        MaximumEventAgeInSeconds: [],
        MaximumRetryAttempts: [],
    }));
    b.m("POST").h(headers).q(query).b(body);
    return b.build();
};
const se_UpdateFunctionUrlConfigCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = {
        "content-type": "application/json",
    };
    b.bp("/2021-10-31/functions/{FunctionName}/url");
    b.p("FunctionName", () => input.FunctionName, "{FunctionName}", false);
    const query = map({
        [_Q]: [, input[_Q]],
    });
    let body;
    body = JSON.stringify(take(input, {
        AuthType: [],
        Cors: (_) => _json(_),
        InvokeMode: [],
    }));
    b.m("PUT").h(headers).q(query).b(body);
    return b.build();
};
const de_AddLayerVersionPermissionCommand = async (output, context) => {
    if (output.statusCode !== 201 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        RevisionId: __expectString,
        Statement: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_AddPermissionCommand = async (output, context) => {
    if (output.statusCode !== 201 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Statement: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CreateAliasCommand = async (output, context) => {
    if (output.statusCode !== 201 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AliasArn: __expectString,
        Description: __expectString,
        FunctionVersion: __expectString,
        Name: __expectString,
        RevisionId: __expectString,
        RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context),
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CreateCodeSigningConfigCommand = async (output, context) => {
    if (output.statusCode !== 201 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        CodeSigningConfig: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CreateEventSourceMappingCommand = async (output, context) => {
    if (output.statusCode !== 202 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AmazonManagedKafkaEventSourceConfig: _json,
        BatchSize: __expectInt32,
        BisectBatchOnFunctionError: __expectBoolean,
        DestinationConfig: _json,
        DocumentDBEventSourceConfig: _json,
        EventSourceArn: __expectString,
        EventSourceMappingArn: __expectString,
        FilterCriteria: _json,
        FilterCriteriaError: _json,
        FunctionArn: __expectString,
        FunctionResponseTypes: _json,
        KMSKeyArn: __expectString,
        LastModified: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        LastProcessingResult: __expectString,
        MaximumBatchingWindowInSeconds: __expectInt32,
        MaximumRecordAgeInSeconds: __expectInt32,
        MaximumRetryAttempts: __expectInt32,
        MetricsConfig: _json,
        ParallelizationFactor: __expectInt32,
        ProvisionedPollerConfig: _json,
        Queues: _json,
        ScalingConfig: _json,
        SelfManagedEventSource: _json,
        SelfManagedKafkaEventSourceConfig: _json,
        SourceAccessConfigurations: _json,
        StartingPosition: __expectString,
        StartingPositionTimestamp: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        State: __expectString,
        StateTransitionReason: __expectString,
        Topics: _json,
        TumblingWindowInSeconds: __expectInt32,
        UUID: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CreateFunctionCommand = async (output, context) => {
    if (output.statusCode !== 201 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Architectures: _json,
        CodeSha256: __expectString,
        CodeSize: __expectLong,
        DeadLetterConfig: _json,
        Description: __expectString,
        Environment: _json,
        EphemeralStorage: _json,
        FileSystemConfigs: _json,
        FunctionArn: __expectString,
        FunctionName: __expectString,
        Handler: __expectString,
        ImageConfigResponse: _json,
        KMSKeyArn: __expectString,
        LastModified: __expectString,
        LastUpdateStatus: __expectString,
        LastUpdateStatusReason: __expectString,
        LastUpdateStatusReasonCode: __expectString,
        Layers: _json,
        LoggingConfig: _json,
        MasterArn: __expectString,
        MemorySize: __expectInt32,
        PackageType: __expectString,
        RevisionId: __expectString,
        Role: __expectString,
        Runtime: __expectString,
        RuntimeVersionConfig: _json,
        SigningJobArn: __expectString,
        SigningProfileVersionArn: __expectString,
        SnapStart: _json,
        State: __expectString,
        StateReason: __expectString,
        StateReasonCode: __expectString,
        Timeout: __expectInt32,
        TracingConfig: _json,
        Version: __expectString,
        VpcConfig: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CreateFunctionUrlConfigCommand = async (output, context) => {
    if (output.statusCode !== 201 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AuthType: __expectString,
        Cors: _json,
        CreationTime: __expectString,
        FunctionArn: __expectString,
        FunctionUrl: __expectString,
        InvokeMode: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_DeleteAliasCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_DeleteCodeSigningConfigCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_DeleteEventSourceMappingCommand = async (output, context) => {
    if (output.statusCode !== 202 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AmazonManagedKafkaEventSourceConfig: _json,
        BatchSize: __expectInt32,
        BisectBatchOnFunctionError: __expectBoolean,
        DestinationConfig: _json,
        DocumentDBEventSourceConfig: _json,
        EventSourceArn: __expectString,
        EventSourceMappingArn: __expectString,
        FilterCriteria: _json,
        FilterCriteriaError: _json,
        FunctionArn: __expectString,
        FunctionResponseTypes: _json,
        KMSKeyArn: __expectString,
        LastModified: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        LastProcessingResult: __expectString,
        MaximumBatchingWindowInSeconds: __expectInt32,
        MaximumRecordAgeInSeconds: __expectInt32,
        MaximumRetryAttempts: __expectInt32,
        MetricsConfig: _json,
        ParallelizationFactor: __expectInt32,
        ProvisionedPollerConfig: _json,
        Queues: _json,
        ScalingConfig: _json,
        SelfManagedEventSource: _json,
        SelfManagedKafkaEventSourceConfig: _json,
        SourceAccessConfigurations: _json,
        StartingPosition: __expectString,
        StartingPositionTimestamp: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        State: __expectString,
        StateTransitionReason: __expectString,
        Topics: _json,
        TumblingWindowInSeconds: __expectInt32,
        UUID: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_DeleteFunctionCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_DeleteFunctionCodeSigningConfigCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_DeleteFunctionConcurrencyCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_DeleteFunctionEventInvokeConfigCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_DeleteFunctionUrlConfigCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_DeleteLayerVersionCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_DeleteProvisionedConcurrencyConfigCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_GetAccountSettingsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AccountLimit: _json,
        AccountUsage: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetAliasCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AliasArn: __expectString,
        Description: __expectString,
        FunctionVersion: __expectString,
        Name: __expectString,
        RevisionId: __expectString,
        RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context),
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetCodeSigningConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        CodeSigningConfig: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetEventSourceMappingCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AmazonManagedKafkaEventSourceConfig: _json,
        BatchSize: __expectInt32,
        BisectBatchOnFunctionError: __expectBoolean,
        DestinationConfig: _json,
        DocumentDBEventSourceConfig: _json,
        EventSourceArn: __expectString,
        EventSourceMappingArn: __expectString,
        FilterCriteria: _json,
        FilterCriteriaError: _json,
        FunctionArn: __expectString,
        FunctionResponseTypes: _json,
        KMSKeyArn: __expectString,
        LastModified: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        LastProcessingResult: __expectString,
        MaximumBatchingWindowInSeconds: __expectInt32,
        MaximumRecordAgeInSeconds: __expectInt32,
        MaximumRetryAttempts: __expectInt32,
        MetricsConfig: _json,
        ParallelizationFactor: __expectInt32,
        ProvisionedPollerConfig: _json,
        Queues: _json,
        ScalingConfig: _json,
        SelfManagedEventSource: _json,
        SelfManagedKafkaEventSourceConfig: _json,
        SourceAccessConfigurations: _json,
        StartingPosition: __expectString,
        StartingPositionTimestamp: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        State: __expectString,
        StateTransitionReason: __expectString,
        Topics: _json,
        TumblingWindowInSeconds: __expectInt32,
        UUID: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetFunctionCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Code: _json,
        Concurrency: _json,
        Configuration: _json,
        Tags: _json,
        TagsError: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetFunctionCodeSigningConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        CodeSigningConfigArn: __expectString,
        FunctionName: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetFunctionConcurrencyCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        ReservedConcurrentExecutions: __expectInt32,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetFunctionConfigurationCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Architectures: _json,
        CodeSha256: __expectString,
        CodeSize: __expectLong,
        DeadLetterConfig: _json,
        Description: __expectString,
        Environment: _json,
        EphemeralStorage: _json,
        FileSystemConfigs: _json,
        FunctionArn: __expectString,
        FunctionName: __expectString,
        Handler: __expectString,
        ImageConfigResponse: _json,
        KMSKeyArn: __expectString,
        LastModified: __expectString,
        LastUpdateStatus: __expectString,
        LastUpdateStatusReason: __expectString,
        LastUpdateStatusReasonCode: __expectString,
        Layers: _json,
        LoggingConfig: _json,
        MasterArn: __expectString,
        MemorySize: __expectInt32,
        PackageType: __expectString,
        RevisionId: __expectString,
        Role: __expectString,
        Runtime: __expectString,
        RuntimeVersionConfig: _json,
        SigningJobArn: __expectString,
        SigningProfileVersionArn: __expectString,
        SnapStart: _json,
        State: __expectString,
        StateReason: __expectString,
        StateReasonCode: __expectString,
        Timeout: __expectInt32,
        TracingConfig: _json,
        Version: __expectString,
        VpcConfig: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetFunctionEventInvokeConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        DestinationConfig: _json,
        FunctionArn: __expectString,
        LastModified: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        MaximumEventAgeInSeconds: __expectInt32,
        MaximumRetryAttempts: __expectInt32,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetFunctionRecursionConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        RecursiveLoop: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetFunctionUrlConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AuthType: __expectString,
        Cors: _json,
        CreationTime: __expectString,
        FunctionArn: __expectString,
        FunctionUrl: __expectString,
        InvokeMode: __expectString,
        LastModifiedTime: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetLayerVersionCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        CompatibleArchitectures: _json,
        CompatibleRuntimes: _json,
        Content: _json,
        CreatedDate: __expectString,
        Description: __expectString,
        LayerArn: __expectString,
        LayerVersionArn: __expectString,
        LicenseInfo: __expectString,
        Version: __expectLong,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetLayerVersionByArnCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        CompatibleArchitectures: _json,
        CompatibleRuntimes: _json,
        Content: _json,
        CreatedDate: __expectString,
        Description: __expectString,
        LayerArn: __expectString,
        LayerVersionArn: __expectString,
        LicenseInfo: __expectString,
        Version: __expectLong,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetLayerVersionPolicyCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Policy: __expectString,
        RevisionId: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetPolicyCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Policy: __expectString,
        RevisionId: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetProvisionedConcurrencyConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AllocatedProvisionedConcurrentExecutions: __expectInt32,
        AvailableProvisionedConcurrentExecutions: __expectInt32,
        LastModified: __expectString,
        RequestedProvisionedConcurrentExecutions: __expectInt32,
        Status: __expectString,
        StatusReason: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_GetRuntimeManagementConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        FunctionArn: __expectString,
        RuntimeVersionArn: __expectString,
        UpdateRuntimeOn: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_InvokeCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = (0,object_mapping/* map */.Tj)({
        $metadata: deserializeMetadata(output),
        [_FE]: [, output.headers[_xafe]],
        [_LR]: [, output.headers[_xalr]],
        [_EV]: [, output.headers[_xaev]],
    });
    const data = await (0,collect_stream_body/* collectBody */.P)(output.body, context);
    contents.Payload = data;
    (0,object_mapping/* map */.Tj)(contents, {
        StatusCode: [, output.statusCode],
    });
    return contents;
};
const de_InvokeAsyncCommand = async (output, context) => {
    if (output.statusCode !== 202 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    map(contents, {
        Status: [, output.statusCode],
    });
    await collectBody(output.body, context);
    return contents;
};
const de_InvokeWithResponseStreamCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
        [_EV]: [, output.headers[_xaev]],
        [_RSCT]: [, output.headers[_ct]],
    });
    const data = output.body;
    contents.EventStream = de_InvokeWithResponseStreamResponseEvent(data, context);
    map(contents, {
        StatusCode: [, output.statusCode],
    });
    return contents;
};
const de_ListAliasesCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Aliases: (_) => de_AliasList(_, context),
        NextMarker: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListCodeSigningConfigsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        CodeSigningConfigs: _json,
        NextMarker: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListEventSourceMappingsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        EventSourceMappings: (_) => de_EventSourceMappingsList(_, context),
        NextMarker: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListFunctionEventInvokeConfigsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        FunctionEventInvokeConfigs: (_) => de_FunctionEventInvokeConfigList(_, context),
        NextMarker: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListFunctionsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Functions: _json,
        NextMarker: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListFunctionsByCodeSigningConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        FunctionArns: _json,
        NextMarker: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListFunctionUrlConfigsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        FunctionUrlConfigs: _json,
        NextMarker: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListLayersCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Layers: _json,
        NextMarker: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListLayerVersionsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        LayerVersions: _json,
        NextMarker: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListProvisionedConcurrencyConfigsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        NextMarker: __expectString,
        ProvisionedConcurrencyConfigs: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListTagsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Tags: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListVersionsByFunctionCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        NextMarker: __expectString,
        Versions: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_PublishLayerVersionCommand = async (output, context) => {
    if (output.statusCode !== 201 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        CompatibleArchitectures: _json,
        CompatibleRuntimes: _json,
        Content: _json,
        CreatedDate: __expectString,
        Description: __expectString,
        LayerArn: __expectString,
        LayerVersionArn: __expectString,
        LicenseInfo: __expectString,
        Version: __expectLong,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_PublishVersionCommand = async (output, context) => {
    if (output.statusCode !== 201 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Architectures: _json,
        CodeSha256: __expectString,
        CodeSize: __expectLong,
        DeadLetterConfig: _json,
        Description: __expectString,
        Environment: _json,
        EphemeralStorage: _json,
        FileSystemConfigs: _json,
        FunctionArn: __expectString,
        FunctionName: __expectString,
        Handler: __expectString,
        ImageConfigResponse: _json,
        KMSKeyArn: __expectString,
        LastModified: __expectString,
        LastUpdateStatus: __expectString,
        LastUpdateStatusReason: __expectString,
        LastUpdateStatusReasonCode: __expectString,
        Layers: _json,
        LoggingConfig: _json,
        MasterArn: __expectString,
        MemorySize: __expectInt32,
        PackageType: __expectString,
        RevisionId: __expectString,
        Role: __expectString,
        Runtime: __expectString,
        RuntimeVersionConfig: _json,
        SigningJobArn: __expectString,
        SigningProfileVersionArn: __expectString,
        SnapStart: _json,
        State: __expectString,
        StateReason: __expectString,
        StateReasonCode: __expectString,
        Timeout: __expectInt32,
        TracingConfig: _json,
        Version: __expectString,
        VpcConfig: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_PutFunctionCodeSigningConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        CodeSigningConfigArn: __expectString,
        FunctionName: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_PutFunctionConcurrencyCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        ReservedConcurrentExecutions: __expectInt32,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_PutFunctionEventInvokeConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        DestinationConfig: _json,
        FunctionArn: __expectString,
        LastModified: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        MaximumEventAgeInSeconds: __expectInt32,
        MaximumRetryAttempts: __expectInt32,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_PutFunctionRecursionConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        RecursiveLoop: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_PutProvisionedConcurrencyConfigCommand = async (output, context) => {
    if (output.statusCode !== 202 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AllocatedProvisionedConcurrentExecutions: __expectInt32,
        AvailableProvisionedConcurrentExecutions: __expectInt32,
        LastModified: __expectString,
        RequestedProvisionedConcurrentExecutions: __expectInt32,
        Status: __expectString,
        StatusReason: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_PutRuntimeManagementConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        FunctionArn: __expectString,
        RuntimeVersionArn: __expectString,
        UpdateRuntimeOn: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_RemoveLayerVersionPermissionCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_RemovePermissionCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_TagResourceCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_UntagResourceCommand = async (output, context) => {
    if (output.statusCode !== 204 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_UpdateAliasCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AliasArn: __expectString,
        Description: __expectString,
        FunctionVersion: __expectString,
        Name: __expectString,
        RevisionId: __expectString,
        RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context),
    });
    Object.assign(contents, doc);
    return contents;
};
const de_UpdateCodeSigningConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        CodeSigningConfig: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_UpdateEventSourceMappingCommand = async (output, context) => {
    if (output.statusCode !== 202 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AmazonManagedKafkaEventSourceConfig: _json,
        BatchSize: __expectInt32,
        BisectBatchOnFunctionError: __expectBoolean,
        DestinationConfig: _json,
        DocumentDBEventSourceConfig: _json,
        EventSourceArn: __expectString,
        EventSourceMappingArn: __expectString,
        FilterCriteria: _json,
        FilterCriteriaError: _json,
        FunctionArn: __expectString,
        FunctionResponseTypes: _json,
        KMSKeyArn: __expectString,
        LastModified: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        LastProcessingResult: __expectString,
        MaximumBatchingWindowInSeconds: __expectInt32,
        MaximumRecordAgeInSeconds: __expectInt32,
        MaximumRetryAttempts: __expectInt32,
        MetricsConfig: _json,
        ParallelizationFactor: __expectInt32,
        ProvisionedPollerConfig: _json,
        Queues: _json,
        ScalingConfig: _json,
        SelfManagedEventSource: _json,
        SelfManagedKafkaEventSourceConfig: _json,
        SourceAccessConfigurations: _json,
        StartingPosition: __expectString,
        StartingPositionTimestamp: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        State: __expectString,
        StateTransitionReason: __expectString,
        Topics: _json,
        TumblingWindowInSeconds: __expectInt32,
        UUID: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_UpdateFunctionCodeCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Architectures: _json,
        CodeSha256: __expectString,
        CodeSize: __expectLong,
        DeadLetterConfig: _json,
        Description: __expectString,
        Environment: _json,
        EphemeralStorage: _json,
        FileSystemConfigs: _json,
        FunctionArn: __expectString,
        FunctionName: __expectString,
        Handler: __expectString,
        ImageConfigResponse: _json,
        KMSKeyArn: __expectString,
        LastModified: __expectString,
        LastUpdateStatus: __expectString,
        LastUpdateStatusReason: __expectString,
        LastUpdateStatusReasonCode: __expectString,
        Layers: _json,
        LoggingConfig: _json,
        MasterArn: __expectString,
        MemorySize: __expectInt32,
        PackageType: __expectString,
        RevisionId: __expectString,
        Role: __expectString,
        Runtime: __expectString,
        RuntimeVersionConfig: _json,
        SigningJobArn: __expectString,
        SigningProfileVersionArn: __expectString,
        SnapStart: _json,
        State: __expectString,
        StateReason: __expectString,
        StateReasonCode: __expectString,
        Timeout: __expectInt32,
        TracingConfig: _json,
        Version: __expectString,
        VpcConfig: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_UpdateFunctionConfigurationCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        Architectures: _json,
        CodeSha256: __expectString,
        CodeSize: __expectLong,
        DeadLetterConfig: _json,
        Description: __expectString,
        Environment: _json,
        EphemeralStorage: _json,
        FileSystemConfigs: _json,
        FunctionArn: __expectString,
        FunctionName: __expectString,
        Handler: __expectString,
        ImageConfigResponse: _json,
        KMSKeyArn: __expectString,
        LastModified: __expectString,
        LastUpdateStatus: __expectString,
        LastUpdateStatusReason: __expectString,
        LastUpdateStatusReasonCode: __expectString,
        Layers: _json,
        LoggingConfig: _json,
        MasterArn: __expectString,
        MemorySize: __expectInt32,
        PackageType: __expectString,
        RevisionId: __expectString,
        Role: __expectString,
        Runtime: __expectString,
        RuntimeVersionConfig: _json,
        SigningJobArn: __expectString,
        SigningProfileVersionArn: __expectString,
        SnapStart: _json,
        State: __expectString,
        StateReason: __expectString,
        StateReasonCode: __expectString,
        Timeout: __expectInt32,
        TracingConfig: _json,
        Version: __expectString,
        VpcConfig: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_UpdateFunctionEventInvokeConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        DestinationConfig: _json,
        FunctionArn: __expectString,
        LastModified: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        MaximumEventAgeInSeconds: __expectInt32,
        MaximumRetryAttempts: __expectInt32,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_UpdateFunctionUrlConfigCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        AuthType: __expectString,
        Cors: _json,
        CreationTime: __expectString,
        FunctionArn: __expectString,
        FunctionUrl: __expectString,
        InvokeMode: __expectString,
        LastModifiedTime: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await (0,parseJsonBody/* parseJsonErrorBody */.CG)(output.body, context),
    };
    const errorCode = (0,parseJsonBody/* loadRestJsonErrorCode */.cJ)(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterValueException":
        case "com.amazonaws.lambda#InvalidParameterValueException":
            throw await de_InvalidParameterValueExceptionRes(parsedOutput, context);
        case "PolicyLengthExceededException":
        case "com.amazonaws.lambda#PolicyLengthExceededException":
            throw await de_PolicyLengthExceededExceptionRes(parsedOutput, context);
        case "PreconditionFailedException":
        case "com.amazonaws.lambda#PreconditionFailedException":
            throw await de_PreconditionFailedExceptionRes(parsedOutput, context);
        case "ResourceConflictException":
        case "com.amazonaws.lambda#ResourceConflictException":
            throw await de_ResourceConflictExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.lambda#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        case "ServiceException":
        case "com.amazonaws.lambda#ServiceException":
            throw await de_ServiceExceptionRes(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.lambda#TooManyRequestsException":
            throw await de_TooManyRequestsExceptionRes(parsedOutput, context);
        case "CodeSigningConfigNotFoundException":
        case "com.amazonaws.lambda#CodeSigningConfigNotFoundException":
            throw await de_CodeSigningConfigNotFoundExceptionRes(parsedOutput, context);
        case "CodeStorageExceededException":
        case "com.amazonaws.lambda#CodeStorageExceededException":
            throw await de_CodeStorageExceededExceptionRes(parsedOutput, context);
        case "CodeVerificationFailedException":
        case "com.amazonaws.lambda#CodeVerificationFailedException":
            throw await de_CodeVerificationFailedExceptionRes(parsedOutput, context);
        case "InvalidCodeSignatureException":
        case "com.amazonaws.lambda#InvalidCodeSignatureException":
            throw await de_InvalidCodeSignatureExceptionRes(parsedOutput, context);
        case "ResourceInUseException":
        case "com.amazonaws.lambda#ResourceInUseException":
            throw await de_ResourceInUseExceptionRes(parsedOutput, context);
        case "ProvisionedConcurrencyConfigNotFoundException":
        case "com.amazonaws.lambda#ProvisionedConcurrencyConfigNotFoundException":
            throw await de_ProvisionedConcurrencyConfigNotFoundExceptionRes(parsedOutput, context);
        case "EC2AccessDeniedException":
        case "com.amazonaws.lambda#EC2AccessDeniedException":
            throw await de_EC2AccessDeniedExceptionRes(parsedOutput, context);
        case "EC2ThrottledException":
        case "com.amazonaws.lambda#EC2ThrottledException":
            throw await de_EC2ThrottledExceptionRes(parsedOutput, context);
        case "EC2UnexpectedException":
        case "com.amazonaws.lambda#EC2UnexpectedException":
            throw await de_EC2UnexpectedExceptionRes(parsedOutput, context);
        case "EFSIOException":
        case "com.amazonaws.lambda#EFSIOException":
            throw await de_EFSIOExceptionRes(parsedOutput, context);
        case "EFSMountConnectivityException":
        case "com.amazonaws.lambda#EFSMountConnectivityException":
            throw await de_EFSMountConnectivityExceptionRes(parsedOutput, context);
        case "EFSMountFailureException":
        case "com.amazonaws.lambda#EFSMountFailureException":
            throw await de_EFSMountFailureExceptionRes(parsedOutput, context);
        case "EFSMountTimeoutException":
        case "com.amazonaws.lambda#EFSMountTimeoutException":
            throw await de_EFSMountTimeoutExceptionRes(parsedOutput, context);
        case "ENILimitReachedException":
        case "com.amazonaws.lambda#ENILimitReachedException":
            throw await de_ENILimitReachedExceptionRes(parsedOutput, context);
        case "InvalidRequestContentException":
        case "com.amazonaws.lambda#InvalidRequestContentException":
            throw await de_InvalidRequestContentExceptionRes(parsedOutput, context);
        case "InvalidRuntimeException":
        case "com.amazonaws.lambda#InvalidRuntimeException":
            throw await de_InvalidRuntimeExceptionRes(parsedOutput, context);
        case "InvalidSecurityGroupIDException":
        case "com.amazonaws.lambda#InvalidSecurityGroupIDException":
            throw await de_InvalidSecurityGroupIDExceptionRes(parsedOutput, context);
        case "InvalidSubnetIDException":
        case "com.amazonaws.lambda#InvalidSubnetIDException":
            throw await de_InvalidSubnetIDExceptionRes(parsedOutput, context);
        case "InvalidZipFileException":
        case "com.amazonaws.lambda#InvalidZipFileException":
            throw await de_InvalidZipFileExceptionRes(parsedOutput, context);
        case "KMSAccessDeniedException":
        case "com.amazonaws.lambda#KMSAccessDeniedException":
            throw await de_KMSAccessDeniedExceptionRes(parsedOutput, context);
        case "KMSDisabledException":
        case "com.amazonaws.lambda#KMSDisabledException":
            throw await de_KMSDisabledExceptionRes(parsedOutput, context);
        case "KMSInvalidStateException":
        case "com.amazonaws.lambda#KMSInvalidStateException":
            throw await de_KMSInvalidStateExceptionRes(parsedOutput, context);
        case "KMSNotFoundException":
        case "com.amazonaws.lambda#KMSNotFoundException":
            throw await de_KMSNotFoundExceptionRes(parsedOutput, context);
        case "RecursiveInvocationException":
        case "com.amazonaws.lambda#RecursiveInvocationException":
            throw await de_RecursiveInvocationExceptionRes(parsedOutput, context);
        case "RequestTooLargeException":
        case "com.amazonaws.lambda#RequestTooLargeException":
            throw await de_RequestTooLargeExceptionRes(parsedOutput, context);
        case "ResourceNotReadyException":
        case "com.amazonaws.lambda#ResourceNotReadyException":
            throw await de_ResourceNotReadyExceptionRes(parsedOutput, context);
        case "SnapStartException":
        case "com.amazonaws.lambda#SnapStartException":
            throw await de_SnapStartExceptionRes(parsedOutput, context);
        case "SnapStartNotReadyException":
        case "com.amazonaws.lambda#SnapStartNotReadyException":
            throw await de_SnapStartNotReadyExceptionRes(parsedOutput, context);
        case "SnapStartTimeoutException":
        case "com.amazonaws.lambda#SnapStartTimeoutException":
            throw await de_SnapStartTimeoutExceptionRes(parsedOutput, context);
        case "SubnetIPAddressLimitReachedException":
        case "com.amazonaws.lambda#SubnetIPAddressLimitReachedException":
            throw await de_SubnetIPAddressLimitReachedExceptionRes(parsedOutput, context);
        case "UnsupportedMediaTypeException":
        case "com.amazonaws.lambda#UnsupportedMediaTypeException":
            throw await de_UnsupportedMediaTypeExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            return throwDefaultError({
                output,
                parsedBody,
                errorCode,
            });
    }
};
const throwDefaultError = (0,default_error_handler/* withBaseException */.j)(LambdaServiceException);
const de_CodeSigningConfigNotFoundExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new CodeSigningConfigNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_CodeStorageExceededExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new CodeStorageExceededException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_CodeVerificationFailedExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new CodeVerificationFailedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_EC2AccessDeniedExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new EC2AccessDeniedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_EC2ThrottledExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new EC2ThrottledException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_EC2UnexpectedExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        EC2ErrorCode: parse_utils/* expectString */.lK,
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new EC2UnexpectedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_EFSIOExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new EFSIOException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_EFSMountConnectivityExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new EFSMountConnectivityException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_EFSMountFailureExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new EFSMountFailureException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_EFSMountTimeoutExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new EFSMountTimeoutException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_ENILimitReachedExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new ENILimitReachedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_InvalidCodeSignatureExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new InvalidCodeSignatureException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_InvalidParameterValueExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new InvalidParameterValueException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_InvalidRequestContentExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new InvalidRequestContentException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_InvalidRuntimeExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new InvalidRuntimeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_InvalidSecurityGroupIDExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new InvalidSecurityGroupIDException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_InvalidSubnetIDExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new InvalidSubnetIDException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_InvalidZipFileExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new InvalidZipFileException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_KMSAccessDeniedExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new KMSAccessDeniedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_KMSDisabledExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new KMSDisabledException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_KMSInvalidStateExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new KMSInvalidStateException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_KMSNotFoundExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new KMSNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_PolicyLengthExceededExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new PolicyLengthExceededException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_PreconditionFailedExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new PreconditionFailedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_ProvisionedConcurrencyConfigNotFoundExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new ProvisionedConcurrencyConfigNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_RecursiveInvocationExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new RecursiveInvocationException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_RequestTooLargeExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new RequestTooLargeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_ResourceConflictExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new ResourceConflictException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_ResourceInUseExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new ResourceInUseException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_ResourceNotFoundExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new ResourceNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_ResourceNotReadyExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new ResourceNotReadyException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_ServiceExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new ServiceException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_SnapStartExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new SnapStartException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_SnapStartNotReadyExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new SnapStartNotReadyException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_SnapStartTimeoutExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new SnapStartTimeoutException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_SubnetIPAddressLimitReachedExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Message: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new SubnetIPAddressLimitReachedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_TooManyRequestsExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({
        [_rAS]: [, parsedOutput.headers[_ra]],
    });
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Reason: parse_utils/* expectString */.lK,
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new TooManyRequestsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_UnsupportedMediaTypeExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        Type: parse_utils/* expectString */.lK,
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new UnsupportedMediaTypeException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_InvokeWithResponseStreamResponseEvent = (output, context) => {
    return context.eventStreamMarshaller.deserialize(output, async (event) => {
        if (event["PayloadChunk"] != null) {
            return {
                PayloadChunk: await de_InvokeResponseStreamUpdate_event(event["PayloadChunk"], context),
            };
        }
        if (event["InvokeComplete"] != null) {
            return {
                InvokeComplete: await de_InvokeWithResponseStreamCompleteEvent_event(event["InvokeComplete"], context),
            };
        }
        return { $unknown: event };
    });
};
const de_InvokeResponseStreamUpdate_event = async (output, context) => {
    const contents = {};
    contents.Payload = output.body;
    return contents;
};
const de_InvokeWithResponseStreamCompleteEvent_event = async (output, context) => {
    const contents = {};
    const data = await parseBody(output.body, context);
    Object.assign(contents, _json(data));
    return contents;
};
const se_AdditionalVersionWeights = (input, context) => {
    return Object.entries(input).reduce((acc, [key, value]) => {
        if (value === null) {
            return acc;
        }
        acc[key] = __serializeFloat(value);
        return acc;
    }, {});
};
const se_AliasRoutingConfiguration = (input, context) => {
    return take(input, {
        AdditionalVersionWeights: (_) => se_AdditionalVersionWeights(_, context),
    });
};
const se_FunctionCode = (input, context) => {
    return take(input, {
        ImageUri: [],
        S3Bucket: [],
        S3Key: [],
        S3ObjectVersion: [],
        SourceKMSKeyArn: [],
        ZipFile: context.base64Encoder,
    });
};
const se_LayerVersionContentInput = (input, context) => {
    return take(input, {
        S3Bucket: [],
        S3Key: [],
        S3ObjectVersion: [],
        ZipFile: context.base64Encoder,
    });
};
const de_AdditionalVersionWeights = (output, context) => {
    return Object.entries(output).reduce((acc, [key, value]) => {
        if (value === null) {
            return acc;
        }
        acc[key] = __limitedParseDouble(value);
        return acc;
    }, {});
};
const de_AliasConfiguration = (output, context) => {
    return take(output, {
        AliasArn: __expectString,
        Description: __expectString,
        FunctionVersion: __expectString,
        Name: __expectString,
        RevisionId: __expectString,
        RoutingConfig: (_) => de_AliasRoutingConfiguration(_, context),
    });
};
const de_AliasList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_AliasConfiguration(entry, context);
    });
    return retVal;
};
const de_AliasRoutingConfiguration = (output, context) => {
    return take(output, {
        AdditionalVersionWeights: (_) => de_AdditionalVersionWeights(_, context),
    });
};
const de_EventSourceMappingConfiguration = (output, context) => {
    return take(output, {
        AmazonManagedKafkaEventSourceConfig: _json,
        BatchSize: __expectInt32,
        BisectBatchOnFunctionError: __expectBoolean,
        DestinationConfig: _json,
        DocumentDBEventSourceConfig: _json,
        EventSourceArn: __expectString,
        EventSourceMappingArn: __expectString,
        FilterCriteria: _json,
        FilterCriteriaError: _json,
        FunctionArn: __expectString,
        FunctionResponseTypes: _json,
        KMSKeyArn: __expectString,
        LastModified: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        LastProcessingResult: __expectString,
        MaximumBatchingWindowInSeconds: __expectInt32,
        MaximumRecordAgeInSeconds: __expectInt32,
        MaximumRetryAttempts: __expectInt32,
        MetricsConfig: _json,
        ParallelizationFactor: __expectInt32,
        ProvisionedPollerConfig: _json,
        Queues: _json,
        ScalingConfig: _json,
        SelfManagedEventSource: _json,
        SelfManagedKafkaEventSourceConfig: _json,
        SourceAccessConfigurations: _json,
        StartingPosition: __expectString,
        StartingPositionTimestamp: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        State: __expectString,
        StateTransitionReason: __expectString,
        Topics: _json,
        TumblingWindowInSeconds: __expectInt32,
        UUID: __expectString,
    });
};
const de_EventSourceMappingsList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_EventSourceMappingConfiguration(entry, context);
    });
    return retVal;
};
const de_FunctionEventInvokeConfig = (output, context) => {
    return take(output, {
        DestinationConfig: _json,
        FunctionArn: __expectString,
        LastModified: (_) => __expectNonNull(__parseEpochTimestamp(__expectNumber(_))),
        MaximumEventAgeInSeconds: __expectInt32,
        MaximumRetryAttempts: __expectInt32,
    });
};
const de_FunctionEventInvokeConfigList = (output, context) => {
    const retVal = (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        return de_FunctionEventInvokeConfig(entry, context);
    });
    return retVal;
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const _A = "Arn";
const _CA = "CompatibleArchitecture";
const _CC = "ClientContext";
const _CR = "CompatibleRuntime";
const _ESA = "EventSourceArn";
const _EV = "ExecutedVersion";
const _FE = "FunctionError";
const _FN = "FunctionName";
const _FV = "FunctionVersion";
const _IT = "InvocationType";
const _L = "List";
const _LR = "LogResult";
const _LT = "LogType";
const _M = "Marker";
const _MI = "MaxItems";
const _MR = "MasterRegion";
const _Q = "Qualifier";
const _RI = "RevisionId";
const _RSCT = "ResponseStreamContentType";
const _TK = "TagKeys";
const _ct = "content-type";
const _f = "find";
const _rAS = "retryAfterSeconds";
const _ra = "retry-after";
const _tK = "tagKeys";
const _xacc = "x-amz-client-context";
const _xaev = "x-amz-executed-version";
const _xafe = "x-amz-function-error";
const _xait = "x-amz-invocation-type";
const _xalr = "x-amz-log-result";
const _xalt = "x-amz-log-type";

;// ./node_modules/@aws-sdk/client-lambda/dist-es/commands/InvokeCommand.js







class InvokeCommand extends command/* Command */.u
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        (0,serdePlugin/* getSerdePlugin */.TM)(config, this.serialize, this.deserialize),
        (0,getEndpointPlugin/* getEndpointPlugin */.r)(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("AWSGirApiService", "Invoke", {})
    .n("LambdaClient", "InvokeCommand")
    .f(InvocationRequestFilterSensitiveLog, InvocationResponseFilterSensitiveLog)
    .ser(se_InvokeCommand)
    .de(de_InvokeCommand)
    .build() {
}

;// ./.warmup/index.mjs

/** Generated by Serverless WarmUp Plugin **/



const uninstrumentedLambdaClient = new LambdaClient({
  apiVersion: '2015-03-31',
  region: 'ap-northeast-2'
});

const lambdaClient = uninstrumentedLambdaClient;

const functions = [
  {
    "name": "flood-info-backend-dev-getFloodData",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-getHanRiverData",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-getFloodDataByLocation",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-getMultiSourceData",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-getMultiSourceDataList",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-refreshFloodData",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-refreshRegionData",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-getDataStatus",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-cleanupOldData",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-getSafeRoute",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-checkProximity",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-getAlternativeRoute",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-geocodeAddress",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-reverseGeocode",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-websocketConnect",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-websocketDisconnect",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-websocketMessage",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-scheduledRefresh",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-dailyCleanup",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-healthCheck",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  },
  {
    "name": "flood-info-backend-dev-getSystemStatus",
    "config": {
      "enabled": true,
      "payload": "{\"source\":\"serverless-plugin-warmup\"}",
      "concurrency": 1
    }
  }
];

function logVerbose(str) {
  console.log(str);
}

function getConcurrency(func, envVars) {
  const functionConcurrency = envVars[`WARMUP_CONCURRENCY_${func.name.toUpperCase().replace(/-/g, '_')}`];

  if (functionConcurrency) {
    const concurrency = parseInt(functionConcurrency);
    logVerbose(`Warming up function: ${func.name} with concurrency: ${concurrency} (from function-specific environment variable)`);
    return concurrency;
  }

  if (envVars.WARMUP_CONCURRENCY) {
    const concurrency = parseInt(envVars.WARMUP_CONCURRENCY);
    logVerbose(`Warming up function: ${func.name} with concurrency: ${concurrency} (from global environment variable)`);
    return concurrency;
  }

  const concurrency = parseInt(func.config.concurrency);
  logVerbose(`Warming up function: ${func.name} with concurrency: ${concurrency}`);
  return concurrency;
}

const warmUp = async (event, context) => {
  logVerbose('Warm Up Start');

  const invokes = await Promise.all(functions.map(async (func) => {
    const concurrency = getConcurrency(func, process.env);

    const clientContext = func.config.clientContext !== undefined
      ? func.config.clientContext
      : func.config.payload;

    const invokeCommand = new InvokeCommand({
      ClientContext: clientContext
        ? Buffer.from(`{"custom":${clientContext}}`).toString('base64')
        : undefined,
      FunctionName: func.name,
      InvocationType: 'RequestResponse',
      LogType: 'None',
      Qualifier: func.config.alias || process.env.SERVERLESS_ALIAS,
      Payload: func.config.payload
    });

    try {
      await Promise.all(Array(concurrency).fill(0).map(async () => await lambdaClient.send(invokeCommand)));
      logVerbose(`Warm Up Invoke Success: ${func.name}`);
      return true;
    } catch (e) {
      console.error(`Warm Up Invoke Error: ${func.name}`, e);
      return false;
    }
  }));

  logVerbose(`Warm Up Finished with ${invokes.filter(r => !r).length} invoke errors`);
}
module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map