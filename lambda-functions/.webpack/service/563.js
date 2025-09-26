"use strict";
exports.id = 563;
exports.ids = [563];
exports.modules = {

/***/ 2563:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  GetRoleCredentialsCommand: () => (/* reexport */ GetRoleCredentialsCommand),
  SSOClient: () => (/* reexport */ SSOClient)
});

// EXTERNAL MODULE: ./node_modules/@smithy/middleware-endpoint/dist-es/getEndpointPlugin.js + 5 modules
var getEndpointPlugin = __webpack_require__(6768);
// EXTERNAL MODULE: ./node_modules/@smithy/middleware-serde/dist-es/serdePlugin.js + 2 modules
var serdePlugin = __webpack_require__(1698);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/command.js + 10 modules
var command = __webpack_require__(8603);
;// ./node_modules/@aws-sdk/client-sso/dist-es/endpoint/EndpointParameters.js
const resolveClientEndpointParameters = (options) => {
    return Object.assign(options, {
        useDualstackEndpoint: options.useDualstackEndpoint ?? false,
        useFipsEndpoint: options.useFipsEndpoint ?? false,
        defaultSigningName: "awsssoportal",
    });
};
const commonParams = {
    UseFIPS: { type: "builtInParams", name: "useFipsEndpoint" },
    Endpoint: { type: "builtInParams", name: "endpoint" },
    Region: { type: "builtInParams", name: "region" },
    UseDualStack: { type: "builtInParams", name: "useDualstackEndpoint" },
};

// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/constants.js
var constants = __webpack_require__(2809);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/exceptions.js
var exceptions = __webpack_require__(4384);
;// ./node_modules/@aws-sdk/client-sso/dist-es/models/SSOServiceException.js


class SSOServiceException extends exceptions/* ServiceException */.T {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, SSOServiceException.prototype);
    }
}

;// ./node_modules/@aws-sdk/client-sso/dist-es/models/models_0.js


class InvalidRequestException extends SSOServiceException {
    name = "InvalidRequestException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "InvalidRequestException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, InvalidRequestException.prototype);
    }
}
class ResourceNotFoundException extends SSOServiceException {
    name = "ResourceNotFoundException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "ResourceNotFoundException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, ResourceNotFoundException.prototype);
    }
}
class TooManyRequestsException extends SSOServiceException {
    name = "TooManyRequestsException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "TooManyRequestsException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, TooManyRequestsException.prototype);
    }
}
class UnauthorizedException extends SSOServiceException {
    name = "UnauthorizedException";
    $fault = "client";
    constructor(opts) {
        super({
            name: "UnauthorizedException",
            $fault: "client",
            ...opts,
        });
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
    }
}
const GetRoleCredentialsRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: constants/* SENSITIVE_STRING */.$ }),
});
const RoleCredentialsFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.secretAccessKey && { secretAccessKey: constants/* SENSITIVE_STRING */.$ }),
    ...(obj.sessionToken && { sessionToken: constants/* SENSITIVE_STRING */.$ }),
});
const GetRoleCredentialsResponseFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.roleCredentials && { roleCredentials: RoleCredentialsFilterSensitiveLog(obj.roleCredentials) }),
});
const ListAccountRolesRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: SENSITIVE_STRING }),
});
const ListAccountsRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: SENSITIVE_STRING }),
});
const LogoutRequestFilterSensitiveLog = (obj) => ({
    ...obj,
    ...(obj.accessToken && { accessToken: SENSITIVE_STRING }),
});

// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/protocols/json/parseJsonBody.js
var parseJsonBody = __webpack_require__(1919);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/submodules/protocols/requestBuilder.js + 1 modules
var requestBuilder = __webpack_require__(9212);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/object-mapping.js
var object_mapping = __webpack_require__(1226);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/is-serializable-header-value.js
var is_serializable_header_value = __webpack_require__(212);
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/submodules/serde/parse-utils.js
var parse_utils = __webpack_require__(6460);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/serde-json.js
var serde_json = __webpack_require__(7268);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/default-error-handler.js
var default_error_handler = __webpack_require__(2967);
;// ./node_modules/@aws-sdk/client-sso/dist-es/protocols/Aws_restJson1.js





const se_GetRoleCredentialsCommand = async (input, context) => {
    const b = (0,requestBuilder/* requestBuilder */.l)(input, context);
    const headers = (0,object_mapping/* map */.Tj)({}, is_serializable_header_value/* isSerializableHeaderValue */.e, {
        [_xasbt]: input[_aT],
    });
    b.bp("/federation/credentials");
    const query = (0,object_mapping/* map */.Tj)({
        [_rn]: [, (0,parse_utils/* expectNonNull */.Y0)(input[_rN], `roleName`)],
        [_ai]: [, (0,parse_utils/* expectNonNull */.Y0)(input[_aI], `accountId`)],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListAccountRolesCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = map({}, isSerializableHeaderValue, {
        [_xasbt]: input[_aT],
    });
    b.bp("/assignment/roles");
    const query = map({
        [_nt]: [, input[_nT]],
        [_mr]: [() => input.maxResults !== void 0, () => input[_mR].toString()],
        [_ai]: [, __expectNonNull(input[_aI], `accountId`)],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_ListAccountsCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = map({}, isSerializableHeaderValue, {
        [_xasbt]: input[_aT],
    });
    b.bp("/assignment/accounts");
    const query = map({
        [_nt]: [, input[_nT]],
        [_mr]: [() => input.maxResults !== void 0, () => input[_mR].toString()],
    });
    let body;
    b.m("GET").h(headers).q(query).b(body);
    return b.build();
};
const se_LogoutCommand = async (input, context) => {
    const b = rb(input, context);
    const headers = map({}, isSerializableHeaderValue, {
        [_xasbt]: input[_aT],
    });
    b.bp("/logout");
    let body;
    b.m("POST").h(headers).b(body);
    return b.build();
};
const de_GetRoleCredentialsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = (0,object_mapping/* map */.Tj)({
        $metadata: deserializeMetadata(output),
    });
    const data = (0,parse_utils/* expectNonNull */.Y0)((0,parse_utils/* expectObject */.Xk)(await (0,parseJsonBody/* parseJsonBody */.Y2)(output.body, context)), "body");
    const doc = (0,object_mapping/* take */.s)(data, {
        roleCredentials: serde_json/* _json */.S,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListAccountRolesCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        nextToken: __expectString,
        roleList: _json,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_ListAccountsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    const data = __expectNonNull(__expectObject(await parseBody(output.body, context)), "body");
    const doc = take(data, {
        accountList: _json,
        nextToken: __expectString,
    });
    Object.assign(contents, doc);
    return contents;
};
const de_LogoutCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return de_CommandError(output, context);
    }
    const contents = map({
        $metadata: deserializeMetadata(output),
    });
    await collectBody(output.body, context);
    return contents;
};
const de_CommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await (0,parseJsonBody/* parseJsonErrorBody */.CG)(output.body, context),
    };
    const errorCode = (0,parseJsonBody/* loadRestJsonErrorCode */.cJ)(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            throw await de_InvalidRequestExceptionRes(parsedOutput, context);
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
            throw await de_ResourceNotFoundExceptionRes(parsedOutput, context);
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            throw await de_TooManyRequestsExceptionRes(parsedOutput, context);
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            throw await de_UnauthorizedExceptionRes(parsedOutput, context);
        default:
            const parsedBody = parsedOutput.body;
            return throwDefaultError({
                output,
                parsedBody,
                errorCode,
            });
    }
};
const throwDefaultError = (0,default_error_handler/* withBaseException */.j)(SSOServiceException);
const de_InvalidRequestExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new InvalidRequestException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_ResourceNotFoundExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new ResourceNotFoundException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_TooManyRequestsExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new TooManyRequestsException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const de_UnauthorizedExceptionRes = async (parsedOutput, context) => {
    const contents = (0,object_mapping/* map */.Tj)({});
    const data = parsedOutput.body;
    const doc = (0,object_mapping/* take */.s)(data, {
        message: parse_utils/* expectString */.lK,
    });
    Object.assign(contents, doc);
    const exception = new UnauthorizedException({
        $metadata: deserializeMetadata(parsedOutput),
        ...contents,
    });
    return (0,exceptions/* decorateServiceException */.M)(exception, parsedOutput.body);
};
const deserializeMetadata = (output) => ({
    httpStatusCode: output.statusCode,
    requestId: output.headers["x-amzn-requestid"] ?? output.headers["x-amzn-request-id"] ?? output.headers["x-amz-request-id"],
    extendedRequestId: output.headers["x-amz-id-2"],
    cfId: output.headers["x-amz-cf-id"],
});
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const _aI = "accountId";
const _aT = "accessToken";
const _ai = "account_id";
const _mR = "maxResults";
const _mr = "max_result";
const _nT = "nextToken";
const _nt = "next_token";
const _rN = "roleName";
const _rn = "role_name";
const _xasbt = "x-amz-sso_bearer_token";

;// ./node_modules/@aws-sdk/client-sso/dist-es/commands/GetRoleCredentialsCommand.js







class GetRoleCredentialsCommand extends command/* Command */.u
    .classBuilder()
    .ep(commonParams)
    .m(function (Command, cs, config, o) {
    return [
        (0,serdePlugin/* getSerdePlugin */.TM)(config, this.serialize, this.deserialize),
        (0,getEndpointPlugin/* getEndpointPlugin */.r)(config, Command.getEndpointParameterInstructions()),
    ];
})
    .s("SWBPortalService", "GetRoleCredentials", {})
    .n("SSOClient", "GetRoleCredentialsCommand")
    .f(GetRoleCredentialsRequestFilterSensitiveLog, GetRoleCredentialsResponseFilterSensitiveLog)
    .ser(se_GetRoleCredentialsCommand)
    .de(de_GetRoleCredentialsCommand)
    .build() {
}

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
;// ./node_modules/@aws-sdk/client-sso/dist-es/auth/httpAuthSchemeProvider.js


const defaultSSOHttpAuthSchemeParametersProvider = async (config, context, input) => {
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
            name: "awsssoportal",
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
function createSmithyApiNoAuthHttpAuthOption(authParameters) {
    return {
        schemeId: "smithy.api#noAuth",
    };
}
const defaultSSOHttpAuthSchemeProvider = (authParameters) => {
    const options = [];
    switch (authParameters.operation) {
        case "GetRoleCredentials": {
            options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
            break;
        }
        case "ListAccountRoles": {
            options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
            break;
        }
        case "ListAccounts": {
            options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
            break;
        }
        case "Logout": {
            options.push(createSmithyApiNoAuthHttpAuthOption(authParameters));
            break;
        }
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

;// ./node_modules/@aws-sdk/client-sso/package.json
const package_namespaceObject = {"rE":"3.896.0"};
// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/client/emitWarningIfUnsupportedVersion.js
var emitWarningIfUnsupportedVersion = __webpack_require__(2741);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/httpAuthSchemes/aws_sdk/NODE_AUTH_SCHEME_PREFERENCE_OPTIONS.js + 2 modules
var NODE_AUTH_SCHEME_PREFERENCE_OPTIONS = __webpack_require__(4472);
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
// EXTERNAL MODULE: ./node_modules/@smithy/core/dist-es/util-identity-and-auth/httpAuthSchemes/noAuth.js
var noAuth = __webpack_require__(5536);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/NoOpLogger.js
var NoOpLogger = __webpack_require__(4098);
// EXTERNAL MODULE: ./node_modules/@smithy/url-parser/dist-es/index.js + 1 modules
var url_parser_dist_es = __webpack_require__(2641);
// EXTERNAL MODULE: ./node_modules/@smithy/util-base64/dist-es/fromBase64.js
var fromBase64 = __webpack_require__(1395);
// EXTERNAL MODULE: ./node_modules/@smithy/util-base64/dist-es/toBase64.js
var toBase64 = __webpack_require__(9718);
// EXTERNAL MODULE: ./node_modules/@smithy/util-utf8/dist-es/fromUtf8.js
var fromUtf8 = __webpack_require__(7459);
// EXTERNAL MODULE: ./node_modules/@smithy/util-utf8/dist-es/toUtf8.js
var toUtf8 = __webpack_require__(7638);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/util-endpoints/dist-es/index.js + 15 modules
var util_endpoints_dist_es = __webpack_require__(643);
// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/cache/EndpointCache.js
var EndpointCache = __webpack_require__(7461);
// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/resolveEndpoint.js + 28 modules
var resolveEndpoint = __webpack_require__(7167);
// EXTERNAL MODULE: ./node_modules/@smithy/util-endpoints/dist-es/utils/customEndpointFunctions.js
var customEndpointFunctions = __webpack_require__(468);
;// ./node_modules/@aws-sdk/client-sso/dist-es/endpoint/ruleset.js
const u = "required", v = "fn", w = "argv", x = "ref";
const a = true, b = "isSet", c = "booleanEquals", d = "error", e = "endpoint", f = "tree", g = "PartitionResult", h = "getAttr", i = { [u]: false, "type": "String" }, j = { [u]: true, "default": false, "type": "Boolean" }, k = { [x]: "Endpoint" }, l = { [v]: c, [w]: [{ [x]: "UseFIPS" }, true] }, m = { [v]: c, [w]: [{ [x]: "UseDualStack" }, true] }, n = {}, o = { [v]: h, [w]: [{ [x]: g }, "supportsFIPS"] }, p = { [x]: g }, q = { [v]: c, [w]: [true, { [v]: h, [w]: [p, "supportsDualStack"] }] }, r = [l], s = [m], t = [{ [x]: "Region" }];
const _data = { version: "1.0", parameters: { Region: i, UseDualStack: j, UseFIPS: j, Endpoint: i }, rules: [{ conditions: [{ [v]: b, [w]: [k] }], rules: [{ conditions: r, error: "Invalid Configuration: FIPS and custom endpoint are not supported", type: d }, { conditions: s, error: "Invalid Configuration: Dualstack and custom endpoint are not supported", type: d }, { endpoint: { url: k, properties: n, headers: n }, type: e }], type: f }, { conditions: [{ [v]: b, [w]: t }], rules: [{ conditions: [{ [v]: "aws.partition", [w]: t, assign: g }], rules: [{ conditions: [l, m], rules: [{ conditions: [{ [v]: c, [w]: [a, o] }, q], rules: [{ endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS and DualStack are enabled, but this partition does not support one or both", type: d }], type: f }, { conditions: r, rules: [{ conditions: [{ [v]: c, [w]: [o, a] }], rules: [{ conditions: [{ [v]: "stringEquals", [w]: [{ [v]: h, [w]: [p, "name"] }, "aws-us-gov"] }], endpoint: { url: "https://portal.sso.{Region}.amazonaws.com", properties: n, headers: n }, type: e }, { endpoint: { url: "https://portal.sso-fips.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "FIPS is enabled but this partition does not support FIPS", type: d }], type: f }, { conditions: s, rules: [{ conditions: [q], rules: [{ endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dualStackDnsSuffix}", properties: n, headers: n }, type: e }], type: f }, { error: "DualStack is enabled but this partition does not support DualStack", type: d }], type: f }, { endpoint: { url: "https://portal.sso.{Region}.{PartitionResult#dnsSuffix}", properties: n, headers: n }, type: e }], type: f }], type: f }, { error: "Invalid Configuration: Missing Region", type: d }] };
const ruleSet = _data;

;// ./node_modules/@aws-sdk/client-sso/dist-es/endpoint/endpointResolver.js



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

;// ./node_modules/@aws-sdk/client-sso/dist-es/runtimeConfig.shared.js








const getRuntimeConfig = (config) => {
    return {
        apiVersion: "2019-06-10",
        base64Decoder: config?.base64Decoder ?? fromBase64/* fromBase64 */.E,
        base64Encoder: config?.base64Encoder ?? toBase64/* toBase64 */.n,
        disableHostPrefix: config?.disableHostPrefix ?? false,
        endpointProvider: config?.endpointProvider ?? defaultEndpointResolver,
        extensions: config?.extensions ?? [],
        httpAuthSchemeProvider: config?.httpAuthSchemeProvider ?? defaultSSOHttpAuthSchemeProvider,
        httpAuthSchemes: config?.httpAuthSchemes ?? [
            {
                schemeId: "aws.auth#sigv4",
                identityProvider: (ipc) => ipc.getIdentityProvider("aws.auth#sigv4"),
                signer: new AwsSdkSigV4Signer/* AwsSdkSigV4Signer */.f2(),
            },
            {
                schemeId: "smithy.api#noAuth",
                identityProvider: (ipc) => ipc.getIdentityProvider("smithy.api#noAuth") || (async () => ({})),
                signer: new noAuth/* NoAuthSigner */.m(),
            },
        ],
        logger: config?.logger ?? new NoOpLogger/* NoOpLogger */.N(),
        serviceId: config?.serviceId ?? "SSO",
        urlParser: config?.urlParser ?? url_parser_dist_es/* parseUrl */.D,
        utf8Decoder: config?.utf8Decoder ?? fromUtf8/* fromUtf8 */.a,
        utf8Encoder: config?.utf8Encoder ?? toUtf8/* toUtf8 */.P,
    };
};

// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/defaults-mode.js
var defaults_mode = __webpack_require__(666);
// EXTERNAL MODULE: ./node_modules/@smithy/util-defaults-mode-node/dist-es/resolveDefaultsModeConfig.js + 2 modules
var resolveDefaultsModeConfig = __webpack_require__(1620);
// EXTERNAL MODULE: ./node_modules/@smithy/smithy-client/dist-es/emitWarningIfUnsupportedVersion.js
var dist_es_emitWarningIfUnsupportedVersion = __webpack_require__(2339);
;// ./node_modules/@aws-sdk/client-sso/dist-es/runtimeConfig.js














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
        defaultUserAgentProvider: config?.defaultUserAgentProvider ??
            (0,defaultUserAgent/* createDefaultUserAgentProvider */.pf)({ serviceId: clientSharedValues.serviceId, clientVersion: package_namespaceObject.rE }),
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
;// ./node_modules/@aws-sdk/client-sso/dist-es/auth/httpAuthExtensionConfiguration.js
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

;// ./node_modules/@aws-sdk/client-sso/dist-es/runtimeExtensions.js




const resolveRuntimeExtensions = (runtimeConfig, extensions) => {
    const extensionConfiguration = Object.assign((0,dist_es_extensions/* getAwsRegionExtensionConfiguration */.R)(runtimeConfig), (0,defaultExtensionConfiguration/* getDefaultExtensionConfiguration */.xA)(runtimeConfig), (0,httpExtensionConfiguration/* getHttpHandlerExtensionConfiguration */.e)(runtimeConfig), getHttpAuthExtensionConfiguration(runtimeConfig));
    extensions.forEach((extension) => extension.configure(extensionConfiguration));
    return Object.assign(runtimeConfig, (0,dist_es_extensions/* resolveAwsRegionExtensionConfiguration */.$)(extensionConfiguration), (0,defaultExtensionConfiguration/* resolveDefaultRuntimeConfig */.uv)(extensionConfiguration), (0,httpExtensionConfiguration/* resolveHttpHandlerRuntimeConfig */.j)(extensionConfiguration), resolveHttpAuthRuntimeConfig(extensionConfiguration));
};

;// ./node_modules/@aws-sdk/client-sso/dist-es/SSOClient.js















class SSOClient extends client/* Client */.K {
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
        const _config_7 = resolveHttpAuthSchemeConfig(_config_6);
        const _config_8 = resolveRuntimeExtensions(_config_7, configuration?.extensions || []);
        this.config = _config_8;
        this.middlewareStack.use((0,user_agent_middleware/* getUserAgentPlugin */.sM)(this.config));
        this.middlewareStack.use((0,retryMiddleware/* getRetryPlugin */.ey)(this.config));
        this.middlewareStack.use((0,middleware_content_length_dist_es/* getContentLengthPlugin */.vK)(this.config));
        this.middlewareStack.use((0,dist_es/* getHostHeaderPlugin */.TC)(this.config));
        this.middlewareStack.use((0,loggerMiddleware/* getLoggerPlugin */.Y7)(this.config));
        this.middlewareStack.use((0,getRecursionDetectionPlugin/* getRecursionDetectionPlugin */.n)(this.config));
        this.middlewareStack.use((0,getHttpAuthSchemeEndpointRuleSetPlugin/* getHttpAuthSchemeEndpointRuleSetPlugin */.w)(this.config, {
            httpAuthSchemeParametersProvider: defaultSSOHttpAuthSchemeParametersProvider,
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

;// ./node_modules/@aws-sdk/credential-provider-sso/dist-es/loadSso.js




/***/ }),

/***/ 5536:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ NoAuthSigner)
/* harmony export */ });
class NoAuthSigner {
    async sign(httpRequest, identity, signingProperties) {
        return httpRequest;
    }
}


/***/ }),

/***/ 7268:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ _json)
/* harmony export */ });
const _json = (obj) => {
    if (obj == null) {
        return {};
    }
    if (Array.isArray(obj)) {
        return obj.filter((_) => _ != null).map(_json);
    }
    if (typeof obj === "object") {
        const target = {};
        for (const key of Object.keys(obj)) {
            if (obj[key] == null) {
                continue;
            }
            target[key] = _json(obj[key]);
        }
        return target;
    }
    return obj;
};


/***/ })

};
;
//# sourceMappingURL=563.js.map