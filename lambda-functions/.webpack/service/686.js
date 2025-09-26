"use strict";
exports.id = 686;
exports.ids = [305,686];
exports.modules = {

/***/ 1305:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  fromSSO: () => (/* reexport */ fromSSO)
});

// UNUSED EXPORTS: isSsoProfile, validateSsoProfile

// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/CredentialsProviderError.js
var CredentialsProviderError = __webpack_require__(3052);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getProfileName.js
var getProfileName = __webpack_require__(6437);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/parseKnownFiles.js + 1 modules
var parseKnownFiles = __webpack_require__(9245);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getConfigFilepath.js
var getConfigFilepath = __webpack_require__(2432);
// EXTERNAL MODULE: ./node_modules/@smithy/types/dist-es/profile.js
var profile = __webpack_require__(5578);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/loadSharedConfigFiles.js + 2 modules
var loadSharedConfigFiles = __webpack_require__(5546);
;// ./node_modules/@smithy/shared-ini-file-loader/dist-es/getSsoSessionData.js


const getSsoSessionData = (data) => Object.entries(data)
    .filter(([key]) => key.startsWith(profile/* IniSectionType */.I.SSO_SESSION + loadSharedConfigFiles/* CONFIG_PREFIX_SEPARATOR */.Q))
    .reduce((acc, [key, value]) => ({ ...acc, [key.substring(key.indexOf(loadSharedConfigFiles/* CONFIG_PREFIX_SEPARATOR */.Q) + 1)]: value }), {});

// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/parseIni.js
var parseIni = __webpack_require__(1476);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/slurpFile.js
var slurpFile = __webpack_require__(589);
;// ./node_modules/@smithy/shared-ini-file-loader/dist-es/loadSsoSessionData.js




const swallowError = () => ({});
const loadSsoSessionData = async (init = {}) => (0,slurpFile/* slurpFile */.$H)(init.configFilepath ?? (0,getConfigFilepath/* getConfigFilepath */.g)())
    .then(parseIni/* parseIni */.A)
    .then(getSsoSessionData)
    .catch(swallowError);

;// ./node_modules/@aws-sdk/credential-provider-sso/dist-es/isSsoProfile.js
const isSsoProfile = (arg) => arg &&
    (typeof arg.sso_start_url === "string" ||
        typeof arg.sso_account_id === "string" ||
        typeof arg.sso_session === "string" ||
        typeof arg.sso_region === "string" ||
        typeof arg.sso_role_name === "string");

// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
var setCredentialFeature = __webpack_require__(244);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/ProviderError.js
var ProviderError = __webpack_require__(6014);
;// ./node_modules/@smithy/property-provider/dist-es/TokenProviderError.js

class TokenProviderError extends ProviderError/* ProviderError */.m {
    constructor(message, options = true) {
        super(message, options);
        this.name = "TokenProviderError";
        Object.setPrototypeOf(this, TokenProviderError.prototype);
    }
}

// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getSSOTokenFromFile.js
var getSSOTokenFromFile = __webpack_require__(4757);
;// ./node_modules/@aws-sdk/token-providers/dist-es/constants.js
const EXPIRE_WINDOW_MS = 5 * 60 * 1000;
const REFRESH_MESSAGE = `To refresh this SSO session run 'aws sso login' with the corresponding profile.`;

;// ./node_modules/@aws-sdk/token-providers/dist-es/getSsoOidcClient.js
const getSsoOidcClient = async (ssoRegion, init = {}) => {
    const { SSOOIDCClient } = await __webpack_require__.e(/* import() */ 521).then(__webpack_require__.bind(__webpack_require__, 5521));
    const ssoOidcClient = new SSOOIDCClient(Object.assign({}, init.clientConfig ?? {}, {
        region: ssoRegion ?? init.clientConfig?.region,
        logger: init.clientConfig?.logger ?? init.parentClientConfig?.logger,
    }));
    return ssoOidcClient;
};

;// ./node_modules/@aws-sdk/token-providers/dist-es/getNewSsoOidcToken.js

const getNewSsoOidcToken = async (ssoToken, ssoRegion, init = {}) => {
    const { CreateTokenCommand } = await __webpack_require__.e(/* import() */ 521).then(__webpack_require__.bind(__webpack_require__, 5521));
    const ssoOidcClient = await getSsoOidcClient(ssoRegion, init);
    return ssoOidcClient.send(new CreateTokenCommand({
        clientId: ssoToken.clientId,
        clientSecret: ssoToken.clientSecret,
        refreshToken: ssoToken.refreshToken,
        grantType: "refresh_token",
    }));
};

;// ./node_modules/@aws-sdk/token-providers/dist-es/validateTokenExpiry.js


const validateTokenExpiry = (token) => {
    if (token.expiration && token.expiration.getTime() < Date.now()) {
        throw new TokenProviderError(`Token is expired. ${REFRESH_MESSAGE}`, false);
    }
};

;// ./node_modules/@aws-sdk/token-providers/dist-es/validateTokenKey.js


const validateTokenKey = (key, value, forRefresh = false) => {
    if (typeof value === "undefined") {
        throw new TokenProviderError(`Value not present for '${key}' in SSO Token${forRefresh ? ". Cannot refresh" : ""}. ${REFRESH_MESSAGE}`, false);
    }
};

// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getSSOTokenFilepath.js
var getSSOTokenFilepath = __webpack_require__(2594);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __webpack_require__(9896);
;// ./node_modules/@aws-sdk/token-providers/dist-es/writeSSOTokenToFile.js


const { writeFile } = external_fs_.promises;
const writeSSOTokenToFile = (id, ssoToken) => {
    const tokenFilepath = (0,getSSOTokenFilepath/* getSSOTokenFilepath */.C)(id);
    const tokenString = JSON.stringify(ssoToken, null, 2);
    return writeFile(tokenFilepath, tokenString);
};

;// ./node_modules/@aws-sdk/token-providers/dist-es/fromSso.js







const lastRefreshAttemptTime = new Date(0);
const fromSso = (_init = {}) => async ({ callerClientConfig } = {}) => {
    const init = {
        ..._init,
        parentClientConfig: {
            ...callerClientConfig,
            ..._init.parentClientConfig,
        },
    };
    init.logger?.debug("@aws-sdk/token-providers - fromSso");
    const profiles = await (0,parseKnownFiles/* parseKnownFiles */.Y)(init);
    const profileName = (0,getProfileName/* getProfileName */.Bz)({
        profile: init.profile ?? callerClientConfig?.profile,
    });
    const profile = profiles[profileName];
    if (!profile) {
        throw new TokenProviderError(`Profile '${profileName}' could not be found in shared credentials file.`, false);
    }
    else if (!profile["sso_session"]) {
        throw new TokenProviderError(`Profile '${profileName}' is missing required property 'sso_session'.`);
    }
    const ssoSessionName = profile["sso_session"];
    const ssoSessions = await loadSsoSessionData(init);
    const ssoSession = ssoSessions[ssoSessionName];
    if (!ssoSession) {
        throw new TokenProviderError(`Sso session '${ssoSessionName}' could not be found in shared credentials file.`, false);
    }
    for (const ssoSessionRequiredKey of ["sso_start_url", "sso_region"]) {
        if (!ssoSession[ssoSessionRequiredKey]) {
            throw new TokenProviderError(`Sso session '${ssoSessionName}' is missing required property '${ssoSessionRequiredKey}'.`, false);
        }
    }
    const ssoStartUrl = ssoSession["sso_start_url"];
    const ssoRegion = ssoSession["sso_region"];
    let ssoToken;
    try {
        ssoToken = await (0,getSSOTokenFromFile/* getSSOTokenFromFile */.v)(ssoSessionName);
    }
    catch (e) {
        throw new TokenProviderError(`The SSO session token associated with profile=${profileName} was not found or is invalid. ${REFRESH_MESSAGE}`, false);
    }
    validateTokenKey("accessToken", ssoToken.accessToken);
    validateTokenKey("expiresAt", ssoToken.expiresAt);
    const { accessToken, expiresAt } = ssoToken;
    const existingToken = { token: accessToken, expiration: new Date(expiresAt) };
    if (existingToken.expiration.getTime() - Date.now() > EXPIRE_WINDOW_MS) {
        return existingToken;
    }
    if (Date.now() - lastRefreshAttemptTime.getTime() < 30 * 1000) {
        validateTokenExpiry(existingToken);
        return existingToken;
    }
    validateTokenKey("clientId", ssoToken.clientId, true);
    validateTokenKey("clientSecret", ssoToken.clientSecret, true);
    validateTokenKey("refreshToken", ssoToken.refreshToken, true);
    try {
        lastRefreshAttemptTime.setTime(Date.now());
        const newSsoOidcToken = await getNewSsoOidcToken(ssoToken, ssoRegion, init);
        validateTokenKey("accessToken", newSsoOidcToken.accessToken);
        validateTokenKey("expiresIn", newSsoOidcToken.expiresIn);
        const newTokenExpiration = new Date(Date.now() + newSsoOidcToken.expiresIn * 1000);
        try {
            await writeSSOTokenToFile(ssoSessionName, {
                ...ssoToken,
                accessToken: newSsoOidcToken.accessToken,
                expiresAt: newTokenExpiration.toISOString(),
                refreshToken: newSsoOidcToken.refreshToken,
            });
        }
        catch (error) {
        }
        return {
            token: newSsoOidcToken.accessToken,
            expiration: newTokenExpiration,
        };
    }
    catch (error) {
        validateTokenExpiry(existingToken);
        return existingToken;
    }
};

;// ./node_modules/@aws-sdk/credential-provider-sso/dist-es/resolveSSOCredentials.js




const SHOULD_FAIL_CREDENTIAL_CHAIN = false;
const resolveSSOCredentials = async ({ ssoStartUrl, ssoSession, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, clientConfig, parentClientConfig, profile, filepath, configFilepath, ignoreCache, logger, }) => {
    let token;
    const refreshMessage = `To refresh this SSO session run aws sso login with the corresponding profile.`;
    if (ssoSession) {
        try {
            const _token = await fromSso({
                profile,
                filepath,
                configFilepath,
                ignoreCache,
            })();
            token = {
                accessToken: _token.token,
                expiresAt: new Date(_token.expiration).toISOString(),
            };
        }
        catch (e) {
            throw new CredentialsProviderError/* CredentialsProviderError */.C(e.message, {
                tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
                logger,
            });
        }
    }
    else {
        try {
            token = await (0,getSSOTokenFromFile/* getSSOTokenFromFile */.v)(ssoStartUrl);
        }
        catch (e) {
            throw new CredentialsProviderError/* CredentialsProviderError */.C(`The SSO session associated with this profile is invalid. ${refreshMessage}`, {
                tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
                logger,
            });
        }
    }
    if (new Date(token.expiresAt).getTime() - Date.now() <= 0) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C(`The SSO session associated with this profile has expired. ${refreshMessage}`, {
            tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
            logger,
        });
    }
    const { accessToken } = token;
    const { SSOClient, GetRoleCredentialsCommand } = await __webpack_require__.e(/* import() */ 563).then(__webpack_require__.bind(__webpack_require__, 2563));
    const sso = ssoClient ||
        new SSOClient(Object.assign({}, clientConfig ?? {}, {
            logger: clientConfig?.logger ?? parentClientConfig?.logger,
            region: clientConfig?.region ?? ssoRegion,
        }));
    let ssoResp;
    try {
        ssoResp = await sso.send(new GetRoleCredentialsCommand({
            accountId: ssoAccountId,
            roleName: ssoRoleName,
            accessToken,
        }));
    }
    catch (e) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C(e, {
            tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
            logger,
        });
    }
    const { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration, credentialScope, accountId } = {}, } = ssoResp;
    if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C("SSO returns an invalid temporary credential.", {
            tryNextLink: SHOULD_FAIL_CREDENTIAL_CHAIN,
            logger,
        });
    }
    const credentials = {
        accessKeyId,
        secretAccessKey,
        sessionToken,
        expiration: new Date(expiration),
        ...(credentialScope && { credentialScope }),
        ...(accountId && { accountId }),
    };
    if (ssoSession) {
        (0,setCredentialFeature/* setCredentialFeature */.g)(credentials, "CREDENTIALS_SSO", "s");
    }
    else {
        (0,setCredentialFeature/* setCredentialFeature */.g)(credentials, "CREDENTIALS_SSO_LEGACY", "u");
    }
    return credentials;
};

;// ./node_modules/@aws-sdk/credential-provider-sso/dist-es/validateSsoProfile.js

const validateSsoProfile = (profile, logger) => {
    const { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile;
    if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", ` +
            `"sso_region", "sso_role_name", "sso_start_url". Got ${Object.keys(profile).join(", ")}\nReference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, { tryNextLink: false, logger });
    }
    return profile;
};

;// ./node_modules/@aws-sdk/credential-provider-sso/dist-es/fromSSO.js





const fromSSO = (init = {}) => async ({ callerClientConfig } = {}) => {
    init.logger?.debug("@aws-sdk/credential-provider-sso - fromSSO");
    const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoSession } = init;
    const { ssoClient } = init;
    const profileName = (0,getProfileName/* getProfileName */.Bz)({
        profile: init.profile ?? callerClientConfig?.profile,
    });
    if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName && !ssoSession) {
        const profiles = await (0,parseKnownFiles/* parseKnownFiles */.Y)(init);
        const profile = profiles[profileName];
        if (!profile) {
            throw new CredentialsProviderError/* CredentialsProviderError */.C(`Profile ${profileName} was not found.`, { logger: init.logger });
        }
        if (!isSsoProfile(profile)) {
            throw new CredentialsProviderError/* CredentialsProviderError */.C(`Profile ${profileName} is not configured with SSO credentials.`, {
                logger: init.logger,
            });
        }
        if (profile?.sso_session) {
            const ssoSessions = await loadSsoSessionData(init);
            const session = ssoSessions[profile.sso_session];
            const conflictMsg = ` configurations in profile ${profileName} and sso-session ${profile.sso_session}`;
            if (ssoRegion && ssoRegion !== session.sso_region) {
                throw new CredentialsProviderError/* CredentialsProviderError */.C(`Conflicting SSO region` + conflictMsg, {
                    tryNextLink: false,
                    logger: init.logger,
                });
            }
            if (ssoStartUrl && ssoStartUrl !== session.sso_start_url) {
                throw new CredentialsProviderError/* CredentialsProviderError */.C(`Conflicting SSO start_url` + conflictMsg, {
                    tryNextLink: false,
                    logger: init.logger,
                });
            }
            profile.sso_region = session.sso_region;
            profile.sso_start_url = session.sso_start_url;
        }
        const { sso_start_url, sso_account_id, sso_region, sso_role_name, sso_session } = validateSsoProfile(profile, init.logger);
        return resolveSSOCredentials({
            ssoStartUrl: sso_start_url,
            ssoSession: sso_session,
            ssoAccountId: sso_account_id,
            ssoRegion: sso_region,
            ssoRoleName: sso_role_name,
            ssoClient: ssoClient,
            clientConfig: init.clientConfig,
            parentClientConfig: init.parentClientConfig,
            profile: profileName,
            filepath: init.filepath,
            configFilepath: init.configFilepath,
            ignoreCache: init.ignoreCache,
            logger: init.logger,
        });
    }
    else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C("Incomplete configuration. The fromSSO() argument hash must include " +
            '"ssoStartUrl", "ssoAccountId", "ssoRegion", "ssoRoleName"', { tryNextLink: false, logger: init.logger });
    }
    else {
        return resolveSSOCredentials({
            ssoStartUrl,
            ssoSession,
            ssoAccountId,
            ssoRegion,
            ssoRoleName,
            ssoClient,
            clientConfig: init.clientConfig,
            parentClientConfig: init.parentClientConfig,
            profile: profileName,
            filepath: init.filepath,
            configFilepath: init.configFilepath,
            ignoreCache: init.ignoreCache,
            logger: init.logger,
        });
    }
};

;// ./node_modules/@aws-sdk/credential-provider-sso/dist-es/index.js






/***/ }),

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
//# sourceMappingURL=686.js.map