"use strict";
exports.id = 819;
exports.ids = [819];
exports.modules = {

/***/ 2594:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ getSSOTokenFilepath)
/* harmony export */ });
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6982);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4547);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _getHomeDir__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7029);



const getSSOTokenFilepath = (id) => {
    const hasher = (0,crypto__WEBPACK_IMPORTED_MODULE_0__.createHash)("sha1");
    const cacheName = hasher.update(id).digest("hex");
    return (0,path__WEBPACK_IMPORTED_MODULE_1__.join)((0,_getHomeDir__WEBPACK_IMPORTED_MODULE_2__/* .getHomeDir */ .R)(), ".aws", "sso", "cache", `${cacheName}.json`);
};


/***/ }),

/***/ 3297:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ externalDataInterceptor)
/* harmony export */ });
/* harmony import */ var _getSSOTokenFromFile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4757);
/* harmony import */ var _slurpFile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(589);


const externalDataInterceptor = {
    getFileRecord() {
        return _slurpFile__WEBPACK_IMPORTED_MODULE_1__/* .fileIntercept */ .Jj;
    },
    interceptFile(path, contents) {
        _slurpFile__WEBPACK_IMPORTED_MODULE_1__/* .fileIntercept */ .Jj[path] = Promise.resolve(contents);
    },
    getTokenRecord() {
        return _getSSOTokenFromFile__WEBPACK_IMPORTED_MODULE_0__/* .tokenIntercept */ .a;
    },
    interceptToken(id, contents) {
        _getSSOTokenFromFile__WEBPACK_IMPORTED_MODULE_0__/* .tokenIntercept */ .a[id] = contents;
    },
};


/***/ }),

/***/ 4757:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ tokenIntercept),
/* harmony export */   v: () => (/* binding */ getSSOTokenFromFile)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9896);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _getSSOTokenFilepath__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2594);


const { readFile } = fs__WEBPACK_IMPORTED_MODULE_0__.promises;
const tokenIntercept = {};
const getSSOTokenFromFile = async (id) => {
    if (tokenIntercept[id]) {
        return tokenIntercept[id];
    }
    const ssoTokenFilepath = (0,_getSSOTokenFilepath__WEBPACK_IMPORTED_MODULE_1__/* .getSSOTokenFilepath */ .C)(id);
    const ssoTokenText = await readFile(ssoTokenFilepath, "utf8");
    return JSON.parse(ssoTokenText);
};


/***/ }),

/***/ 7819:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  fromTokenFile: () => (/* reexport */ fromTokenFile),
  fromWebToken: () => (/* reexport */ fromWebToken)
});

// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
var setCredentialFeature = __webpack_require__(244);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/CredentialsProviderError.js
var CredentialsProviderError = __webpack_require__(3052);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/externalDataInterceptor.js
var externalDataInterceptor = __webpack_require__(3297);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(9896);
;// ./node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromWebToken.js
const fromWebToken = (init) => async (awsIdentityProperties) => {
    init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromWebToken");
    const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds } = init;
    let { roleAssumerWithWebIdentity } = init;
    if (!roleAssumerWithWebIdentity) {
        const { getDefaultRoleAssumerWithWebIdentity } = await __webpack_require__.e(/* import() */ 906).then(__webpack_require__.bind(__webpack_require__, 6906));
        roleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity({
            ...init.clientConfig,
            credentialProviderLogger: init.logger,
            parentClientConfig: {
                ...awsIdentityProperties?.callerClientConfig,
                ...init.parentClientConfig,
            },
        }, init.clientPlugins);
    }
    return roleAssumerWithWebIdentity({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName ?? `aws-sdk-js-session-${Date.now()}`,
        WebIdentityToken: webIdentityToken,
        ProviderId: providerId,
        PolicyArns: policyArns,
        Policy: policy,
        DurationSeconds: durationSeconds,
    });
};

;// ./node_modules/@aws-sdk/credential-provider-web-identity/dist-es/fromTokenFile.js





const ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
const ENV_ROLE_ARN = "AWS_ROLE_ARN";
const ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
const fromTokenFile = (init = {}) => async () => {
    init.logger?.debug("@aws-sdk/credential-provider-web-identity - fromTokenFile");
    const webIdentityTokenFile = init?.webIdentityTokenFile ?? process.env[ENV_TOKEN_FILE];
    const roleArn = init?.roleArn ?? process.env[ENV_ROLE_ARN];
    const roleSessionName = init?.roleSessionName ?? process.env[ENV_ROLE_SESSION_NAME];
    if (!webIdentityTokenFile || !roleArn) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C("Web identity configuration not specified", {
            logger: init.logger,
        });
    }
    const credentials = await fromWebToken({
        ...init,
        webIdentityToken: externalDataInterceptor/* externalDataInterceptor */.Z?.getTokenRecord?.()[webIdentityTokenFile] ??
            (0,external_fs_.readFileSync)(webIdentityTokenFile, { encoding: "ascii" }),
        roleArn,
        roleSessionName,
    })();
    if (webIdentityTokenFile === process.env[ENV_TOKEN_FILE]) {
        (0,setCredentialFeature/* setCredentialFeature */.g)(credentials, "CREDENTIALS_ENV_VARS_STS_WEB_ID_TOKEN", "h");
    }
    return credentials;
};

;// ./node_modules/@aws-sdk/credential-provider-web-identity/dist-es/index.js




/***/ })

};
;
//# sourceMappingURL=819.js.map