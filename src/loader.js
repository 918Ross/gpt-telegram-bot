export class Loader {
    icons = ['👀', '🛑']

    constructor(ctx) { this.ctx = ctx }
    async show() {
        this.message = await this.ctx.reply(this.icons[0])
    }
    async error() {
        this.message = await this.ctx.reply(this.icons[1])
    }
    hide() {
        this.ctx.telegram.deleteMessage(this.ctx.chat.id, this.message.message_id)
    }
}