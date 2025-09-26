"use strict";
exports.id = 789;
exports.ids = [789];
exports.modules = {

/***/ 2789:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  fromIni: () => (/* reexport */ fromIni)
});

// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/parseKnownFiles.js + 1 modules
var parseKnownFiles = __webpack_require__(9245);
// EXTERNAL MODULE: ./node_modules/@smithy/shared-ini-file-loader/dist-es/getProfileName.js
var getProfileName = __webpack_require__(6437);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/CredentialsProviderError.js
var CredentialsProviderError = __webpack_require__(3052);
// EXTERNAL MODULE: ./node_modules/@aws-sdk/core/dist-es/submodules/client/setCredentialFeature.js
var setCredentialFeature = __webpack_require__(244);
// EXTERNAL MODULE: ./node_modules/@smithy/property-provider/dist-es/chain.js
var chain = __webpack_require__(8062);
;// ./node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveCredentialSource.js


const resolveCredentialSource = (credentialSource, profileName, logger) => {
    const sourceProvidersMap = {
        EcsContainer: async (options) => {
            const { fromHttp } = await __webpack_require__.e(/* import() */ 703).then(__webpack_require__.bind(__webpack_require__, 8703));
            const { fromContainerMetadata } = await __webpack_require__.e(/* import() */ 897).then(__webpack_require__.bind(__webpack_require__, 7897));
            logger?.debug("@aws-sdk/credential-provider-ini - credential_source is EcsContainer");
            return async () => (0,chain/* chain */.c)(fromHttp(options ?? {}), fromContainerMetadata(options))().then(setNamedProvider);
        },
        Ec2InstanceMetadata: async (options) => {
            logger?.debug("@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata");
            const { fromInstanceMetadata } = await __webpack_require__.e(/* import() */ 897).then(__webpack_require__.bind(__webpack_require__, 7897));
            return async () => fromInstanceMetadata(options)().then(setNamedProvider);
        },
        Environment: async (options) => {
            logger?.debug("@aws-sdk/credential-provider-ini - credential_source is Environment");
            const { fromEnv } = await __webpack_require__.e(/* import() */ 677).then(__webpack_require__.bind(__webpack_require__, 677));
            return async () => fromEnv(options)().then(setNamedProvider);
        },
    };
    if (credentialSource in sourceProvidersMap) {
        return sourceProvidersMap[credentialSource];
    }
    else {
        throw new CredentialsProviderError/* CredentialsProviderError */.C(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, ` +
            `expected EcsContainer or Ec2InstanceMetadata or Environment.`, { logger });
    }
};
const setNamedProvider = (creds) => (0,setCredentialFeature/* setCredentialFeature */.g)(creds, "CREDENTIALS_PROFILE_NAMED_PROVIDER", "p");

;// ./node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveAssumeRoleCredentials.js





const isAssumeRoleProfile = (arg, { profile = "default", logger } = {}) => {
    return (Boolean(arg) &&
        typeof arg === "object" &&
        typeof arg.role_arn === "string" &&
        ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 &&
        ["undefined", "string"].indexOf(typeof arg.external_id) > -1 &&
        ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1 &&
        (isAssumeRoleWithSourceProfile(arg, { profile, logger }) || isCredentialSourceProfile(arg, { profile, logger })));
};
const isAssumeRoleWithSourceProfile = (arg, { profile, logger }) => {
    const withSourceProfile = typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
    if (withSourceProfile) {
        logger?.debug?.(`    ${profile} isAssumeRoleWithSourceProfile source_profile=${arg.source_profile}`);
    }
    return withSourceProfile;
};
const isCredentialSourceProfile = (arg, { profile, logger }) => {
    const withProviderProfile = typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
    if (withProviderProfile) {
        logger?.debug?.(`    ${profile} isCredentialSourceProfile credential_source=${arg.credential_source}`);
    }
    return withProviderProfile;
};
const resolveAssumeRoleCredentials = async (profileName, profiles, options, visitedProfiles = {}) => {
    options.logger?.debug("@aws-sdk/credential-provider-ini - resolveAssumeRoleCredentials (STS)");
    const profileData = profiles[profileName];
    const { source_profile, region } = profileData;
    if (!options.roleAssumer) {
        const { getDefaultRoleAssumer } = await __webpack_require__.e(/* import() */ 906).then(__webpack_require__.bind(__webpack_require__, 6906));
        options.roleAssumer = getDefaultRoleAssumer({
            ...options.clientConfig,
            credentialProviderLogger: options.logger,
            parentClientConfig: {
                ...options?.parentClientConfig,
                region: region ?? options?.parentClientConfig?.region,
            },
        }, options.clientPlugins);
    }
    if (source_profile && source_profile in visitedProfiles) {
        throw new CredentialsProviderError/* CredentialsProviderError */.C(`Detected a cycle attempting to resolve credentials for profile` +
            ` ${(0,getProfileName/* getProfileName */.Bz)(options)}. Profiles visited: ` +
            Object.keys(visitedProfiles).join(", "), { logger: options.logger });
    }
    options.logger?.debug(`@aws-sdk/credential-provider-ini - finding credential resolver using ${source_profile ? `source_profile=[${source_profile}]` : `profile=[${profileName}]`}`);
    const sourceCredsProvider = source_profile
        ? resolveProfileData(source_profile, profiles, options, {
            ...visitedProfiles,
            [source_profile]: true,
        }, isCredentialSourceWithoutRoleArn(profiles[source_profile] ?? {}))
        : (await resolveCredentialSource(profileData.credential_source, profileName, options.logger)(options))();
    if (isCredentialSourceWithoutRoleArn(profileData)) {
        return sourceCredsProvider.then((creds) => (0,setCredentialFeature/* setCredentialFeature */.g)(creds, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
    }
    else {
        const params = {
            RoleArn: profileData.role_arn,
            RoleSessionName: profileData.role_session_name || `aws-sdk-js-${Date.now()}`,
            ExternalId: profileData.external_id,
            DurationSeconds: parseInt(profileData.duration_seconds || "3600", 10),
        };
        const { mfa_serial } = profileData;
        if (mfa_serial) {
            if (!options.mfaCodeProvider) {
                throw new CredentialsProviderError/* CredentialsProviderError */.C(`Profile ${profileName} requires multi-factor authentication, but no MFA code callback was provided.`, { logger: options.logger, tryNextLink: false });
            }
            params.SerialNumber = mfa_serial;
            params.TokenCode = await options.mfaCodeProvider(mfa_serial);
        }
        const sourceCreds = await sourceCredsProvider;
        return options.roleAssumer(sourceCreds, params).then((creds) => (0,setCredentialFeature/* setCredentialFeature */.g)(creds, "CREDENTIALS_PROFILE_SOURCE_PROFILE", "o"));
    }
};
const isCredentialSourceWithoutRoleArn = (section) => {
    return !section.role_arn && !!section.credential_source;
};

;// ./node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveProcessCredentials.js

const isProcessProfile = (arg) => Boolean(arg) && typeof arg === "object" && typeof arg.credential_process === "string";
const resolveProcessCredentials = async (options, profile) => __webpack_require__.e(/* import() */ 109).then(__webpack_require__.bind(__webpack_require__, 5109)).then(({ fromProcess }) => fromProcess({
    ...options,
    profile,
})().then((creds) => (0,setCredentialFeature/* setCredentialFeature */.g)(creds, "CREDENTIALS_PROFILE_PROCESS", "v")));

;// ./node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveSsoCredentials.js

const resolveSsoCredentials = async (profile, profileData, options = {}) => {
    const { fromSSO } = await __webpack_require__.e(/* import() */ 305).then(__webpack_require__.bind(__webpack_require__, 1305));
    return fromSSO({
        profile,
        logger: options.logger,
        parentClientConfig: options.parentClientConfig,
        clientConfig: options.clientConfig,
    })().then((creds) => {
        if (profileData.sso_session) {
            return (0,setCredentialFeature/* setCredentialFeature */.g)(creds, "CREDENTIALS_PROFILE_SSO", "r");
        }
        else {
            return (0,setCredentialFeature/* setCredentialFeature */.g)(creds, "CREDENTIALS_PROFILE_SSO_LEGACY", "t");
        }
    });
};
const isSsoProfile = (arg) => arg &&
    (typeof arg.sso_start_url === "string" ||
        typeof arg.sso_account_id === "string" ||
        typeof arg.sso_session === "string" ||
        typeof arg.sso_region === "string" ||
        typeof arg.sso_role_name === "string");

;// ./node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveStaticCredentials.js

const isStaticCredsProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.aws_access_key_id === "string" &&
    typeof arg.aws_secret_access_key === "string" &&
    ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1 &&
    ["undefined", "string"].indexOf(typeof arg.aws_account_id) > -1;
const resolveStaticCredentials = async (profile, options) => {
    options?.logger?.debug("@aws-sdk/credential-provider-ini - resolveStaticCredentials");
    const credentials = {
        accessKeyId: profile.aws_access_key_id,
        secretAccessKey: profile.aws_secret_access_key,
        sessionToken: profile.aws_session_token,
        ...(profile.aws_credential_scope && { credentialScope: profile.aws_credential_scope }),
        ...(profile.aws_account_id && { accountId: profile.aws_account_id }),
    };
    return (0,setCredentialFeature/* setCredentialFeature */.g)(credentials, "CREDENTIALS_PROFILE", "n");
};

;// ./node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveWebIdentityCredentials.js

const isWebIdentityProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.web_identity_token_file === "string" &&
    typeof arg.role_arn === "string" &&
    ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
const resolveWebIdentityCredentials = async (profile, options) => __webpack_require__.e(/* import() */ 819).then(__webpack_require__.bind(__webpack_require__, 7819)).then(({ fromTokenFile }) => fromTokenFile({
    webIdentityTokenFile: profile.web_identity_token_file,
    roleArn: profile.role_arn,
    roleSessionName: profile.role_session_name,
    roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity,
    logger: options.logger,
    parentClientConfig: options.parentClientConfig,
})().then((creds) => (0,setCredentialFeature/* setCredentialFeature */.g)(creds, "CREDENTIALS_PROFILE_STS_WEB_ID_TOKEN", "q")));

;// ./node_modules/@aws-sdk/credential-provider-ini/dist-es/resolveProfileData.js






const resolveProfileData = async (profileName, profiles, options, visitedProfiles = {}, isAssumeRoleRecursiveCall = false) => {
    const data = profiles[profileName];
    if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) {
        return resolveStaticCredentials(data, options);
    }
    if (isAssumeRoleRecursiveCall || isAssumeRoleProfile(data, { profile: profileName, logger: options.logger })) {
        return resolveAssumeRoleCredentials(profileName, profiles, options, visitedProfiles);
    }
    if (isStaticCredsProfile(data)) {
        return resolveStaticCredentials(data, options);
    }
    if (isWebIdentityProfile(data)) {
        return resolveWebIdentityCredentials(data, options);
    }
    if (isProcessProfile(data)) {
        return resolveProcessCredentials(options, profileName);
    }
    if (isSsoProfile(data)) {
        return await resolveSsoCredentials(profileName, data, options);
    }
    throw new CredentialsProviderError/* CredentialsProviderError */.C(`Could not resolve credentials using profile: [${profileName}] in configuration/credentials file(s).`, { logger: options.logger });
};

;// ./node_modules/@aws-sdk/credential-provider-ini/dist-es/fromIni.js


const fromIni = (_init = {}) => async ({ callerClientConfig } = {}) => {
    const init = {
        ..._init,
        parentClientConfig: {
            ...callerClientConfig,
            ..._init.parentClientConfig,
        },
    };
    init.logger?.debug("@aws-sdk/credential-provider-ini - fromIni");
    const profiles = await (0,parseKnownFiles/* parseKnownFiles */.Y)(init);
    return resolveProfileData((0,getProfileName/* getProfileName */.Bz)({
        profile: _init.profile ?? callerClientConfig?.profile,
    }), profiles, init);
};

;// ./node_modules/@aws-sdk/credential-provider-ini/dist-es/index.js



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
//# sourceMappingURL=789.js.map