export const valid_email: string[] = [
    "@gmail.com",
    "@yahoo.com",
    "@outlook.com",
    "@hotmail.com",
    "@icloud.com",
    "@aol.com",
    "@mail.com",
    "@protonmail.com",
    "@yandex.com",
    "@zoho.com",
    "@inbox.com",
    "@gmx.com",
    "@fastmail.com",
    "@live.com",
    "@me.com",
    "@qq.com",
    "@163.com",
    "@126.com",
    "@rocketmail.com",
    "@rediffmail.com",
    "@tutanota.com",
    "@seznam.cz",
    "@naver.com",
    "@daum.net",
    "@hanmail.net",
    "@lycos.com",
    "@bluewin.ch",
    "@t-online.de"
];

export function validEmailChecker(email: string) {
    if (!email.slice(0, email.indexOf("@"))) {
        return false
    }
    const email_ext = email.slice(email.indexOf("@"));
    const result = valid_email.includes(email_ext)
    return result
}