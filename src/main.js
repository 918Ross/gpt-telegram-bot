import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { Loader } from './loader.js'
import OpenAI from 'openai'
import config from 'config'

const GPT_MODEL = 'gpt-4o'
const PROMPT_1 = 'Сделай краткую выжимку и вывод простыми словами. Если контекcт про экономику, дополнительно дай оценку, положительно или отрицательно это влияет на крипторынок и экономику США '
const client = new OpenAI({
    apiKey: config.get('OPENAI_API_KEY'), // Вставьте сюда апи ключ 
});
const bot = new Telegraf(config.get('apiKey'), {      // вместо 'apiKey' вставьте апи ключ вашего бота тг  
    handlerTimeout: Infinity
})
bot.on(message, async (ctx) => {
    let channelMsg = ''
    typeof ctx.message.caption === 'string' ? channelMsg = ctx.message.caption : false
    typeof ctx.message.text === 'string' ? channelMsg = ctx.message.text : false
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