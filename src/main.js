import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { Loader } from './loader.js'
import OpenAI from 'openai'
import config from 'config'

const GPT_MODEL = 'gpt-4o'
const PROMPT_1 = 'Сделай краткую выжимку. Если контекcт про экономику, сделай оценочный вывод простыми словами, положительно или отрицательно это влияет на крипторынок и экономику США. Если есть ссылка внутри текста то открой и сделай ее выжимку'
const client = new OpenAI({
    apiKey: config.get('OPENAI_API_KEY'),
});
const bot = new Telegraf(config.get('apiKey'), {
    handlerTimeout: Infinity
})
bot.on(message, async (ctx) => {

    const channelMsg = typeof ctx.message.caption === 'string' ? ctx.message.caption : ctx.message.text
    const loader = new Loader(ctx)
    loader.show()
    try {
        const response = await client.responses.create({
            model: GPT_MODEL,
            instructions: PROMPT_1,
            input: channelMsg,
        })
        console.log('🟢 ', response.output_text, '🟢');
        ctx.reply(response.output_text, {
            reply_parameters: {
                message_id: ctx.message.message_id
            }
        })
        loader.hide()
    } catch (error) {
        loader.error()
        console.log(error)
    }
})
bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))