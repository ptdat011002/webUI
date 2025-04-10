export interface ILockPassWord {
    login_failed_number: number;
    lock_user_timeout: string;
    login_failed_timeout: string;
    session_timeout: string;
    device_name: string;
    menu_timeouts: number;
    preview_session_timeout: boolean;
}

export interface IPortManagement {
    old_index: number;
    service: string;
    port: number;
    protocol: string;
}