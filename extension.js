const vscode = require('vscode');
const { WebClient } = require('@slack/web-api');

async function sendMessage(text) {
    // 설정 읽기
    const config = vscode.workspace.getConfiguration('sendSlackMessage');
    const token = config.get('token');
    const channel = config.get('channel');

    // 토큰과 채널 설정되어 있는지 확인
    if (!token || !channel) {
        vscode.window.showErrorMessage('VSCode의 설정에서 토큰과 채널을 설정해주세요.');
        return;
    }

    // Slack 웹 클라이언트를 생성
    const web = new WebClient(token);

    try {
        // 메시지를 보내기
        await web.chat.postMessage({
            channel: channel,
            text: text,
        });

        // 성공 시
        let infoMessage = vscode.window.showInformationMessage('일정 등록 성공');

        setTimeout(() => {
            infoMessage.dispose();
            vscode.window.showInformationMessage('');
        }, 1000);
    } catch (error) {
        // 실패 시
        let errorMessage = vscode.window.showErrorMessage(`일정 등록 실패 | ${error.message}`);

        setTimeout(() => {
            errorMessage.dispose();
            vscode.window.showErrorMessage('');
        }, 1000);
    }
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.sendSlackMessage', async function () {
        // 메시지를 입력 받기
        const message = await vscode.window.showInputBox({ prompt: '일정을 입력하세요.' });

        if (message) {
            // 메시지가 있으면 Slack에 보내기
            await sendMessage(message);
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
