"use strict";
exports.id = 490;
exports.ids = [109,490];
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

/***/ 5109:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  fromProcess: () => (/* reexport */ fromProcess)
});

// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/parseKnownFiles.js + 1 modules
var parseKnownFiles = __webpack_require__(9245);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getProfileName.js
var getProfileName = __webpack_require__(6437);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/CredentialsProviderError.js
var CredentialsProviderError = __webpack_require__(3052);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/externalDataInterceptor.js
var externalDataInterceptor = __webpack_require__(3297);
// EXTERNAL MODULE: external "child_process"
var external_child_process_ = __webpack_require__(5317);
// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(9023);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
var setCredentialFeature = __webpack_require__(244);
;// ./node_modules/@aws-sdk/credential-provider-process/dist-es/getValidatedProcessCredentials.js

const getValidatedProcessCredentials = (profileName, data, profiles) => {
    if (data.Version !== 1) {
        throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
    }
    if (data.AccessKeyId === undefined || data.SecretAccessKey === undefined) {
        throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
    }
    if (data.Expiration) {
        const currentTime = new Date();
        const expireTime = new Date(data.Expiration);
        if (expireTime < currentTime) {
            throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
        }
    }
    let accountId = data.AccountId;
    if (!accountId && profiles?.[profileName]?.aws_account_id) {
        accountId = profiles[profileName].aws_account_id;
    }
    const credentials = {
        accessKeyId: data.AccessKeyId,
        secretAccessKey: data.SecretAccessKey,
        ...(data.SessionToken && { sessionToken: data.SessionToken }),
        ...(data.Expiration && { expiration: new Date(data.Expiration) }),
        ...(data.CredentialScope && { credentialScope: data.CredentialScope }),
        ...(accountId && { accountId }),
    };
    (0,setCredentialFeature/* setCredentialFeature */.g)(credentials, "CREDENTIALS_PROCESS", "w");
    return credentials;
};

;// ./node_modules/@aws-sdk/credential-provider-process/dist-es/resolveProcessCredentials.js





const resolveProcessCredentials = async (profileName, profiles, logger) => {
    const profile = profiles[profileName];
    if (profiles[profileName]) {
        const credentialProcess = profile["credential_process"];
        if (credentialProcess !== undefined) {
            const execPromise = (0,external_util_.promisify)(externalDataInterceptor/* externalDataInterceptor */.Z?.getTokenRecord?.().exec ?? external_child_process_.exec);
            try {
                const { stdout } = await execPromise(credentialProcess);
                let data;
                try {
                    data = JSON.parse(stdout.trim());
                }
                catch {
                    throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
                }
                return getValidatedProcessCredentials(profileName, data, profiles);
            }
            catch (error) {
                throw new CredentialsProviderError/* CredentialsProviderError */.C(error.message, { logger });
            }
        }
        else {
            throw new CredentialsProviderError/* CredentialsProviderError */.C(`Profile ${profileName} did not contain credential_process.`, { logger });
        }
    }
    else {
        throw new CredentialsProviderError/* CredentialsProviderError */.C(`Profile ${profileName} could not be found in shared credentials file.`, {
            logger,
        });
    }
};

;// ./node_modules/@aws-sdk/credential-provider-process/dist-es/fromProcess.js


const fromProcess = (init = {}) => async ({ callerClientConfig } = {}) => {
    init.logger?.debug("@aws-sdk/credential-provider-process - fromProcess");
    const profiles = await (0,parseKnownFiles/* parseKnownFiles */.Y)(init);
    return resolveProcessCredentials((0,getProfileName/* getProfileName */.Bz)({
        profile: init.profile ?? callerClientConfig?.profile,
    }), profiles, init.logger);
};

;// ./node_modules/@aws-sdk/credential-provider-process/dist-es/index.js



/***/ }),

/***/ 9245:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Y: () => (/* binding */ parseKnownFiles)
});

// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/loadSharedConfigFiles.js + 2 modules
var loadSharedConfigFiles = __webpack_require__(5546);
;// ./node_modules/@smithy/shared-ini-file-loader/dist-es/mergeConfigFiles.js
const mergeConfigFiles = (...files) => {
    const merged = {};
    for (const file of files) {
        for (const [key, values] of Object.entries(file)) {
            if (merged[key] !== undefined) {
                Object.assign(merged[key], values);
            }
            else {
                merged[key] = values;
            }
        }
    }
    return merged;
};

;// ./node_modules/@smithy/shared-ini-file-loader/dist-es/parseKnownFiles.js


const parseKnownFiles = async (init) => {
    const parsedFiles = await (0,loadSharedConfigFiles/* loadSharedConfigFiles */.p)(init);
    return mergeConfigFiles(parsedFiles.configFile, parsedFiles.credentialsFile);
};


/***/ })

};
;
//# sourceMappingURL=490.js.map