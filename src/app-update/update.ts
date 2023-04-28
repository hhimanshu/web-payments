import {AppUpdate, AppUpdateAvailability} from '@capawesome/capacitor-app-update';

const getCurrentAppVersion = async () => {
    const result = await AppUpdate.getAppUpdateInfo();
    return result.currentVersion;
};

const getAvailableAppVersion = async () => {
    const result = await AppUpdate.getAppUpdateInfo();
    return result.availableVersion;
};

export const openAppStore = async () => {
    await AppUpdate.openAppStore();
};

const performImmediateUpdate = async () => {
    const result = await AppUpdate.getAppUpdateInfo();
    if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
        return;
    }
    if (result.immediateUpdateAllowed) {
        await AppUpdate.performImmediateUpdate();
    }
};

const startFlexibleUpdate = async () => {
    const result = await AppUpdate.getAppUpdateInfo();
    if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
        return;
    }
    if (result.flexibleUpdateAllowed) {
        await AppUpdate.startFlexibleUpdate();
    }
};

const completeFlexibleUpdate = async () => {
    await AppUpdate.completeFlexibleUpdate();
};

export const shouldAppUpdate = async (): Promise<boolean> => {
    const currentVer = await getCurrentAppVersion();
    const availableVer = await getAvailableAppVersion();
    //const availableVer = "3";
    console.log(`currentVersion=${currentVer}, availableVersion=${availableVer}`)
    return availableVer !== currentVer
}
