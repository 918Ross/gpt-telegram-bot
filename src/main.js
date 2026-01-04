import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import OpenAI from 'openai'
import config from 'config'

const GPT_MODEL = 'gpt-4o'
const PROMPT_1 = 'Сделай выжимку и вывод. Если контекcт про экономику, дополнительно дай оценку, положительно или отрицательно это влияет на экономику'
const client = new OpenAI({
    apiKey: config.get('OPENAI_API_KEY'), // This is the default and can be omitted
});
const bot = new Telegraf(config.get('apiKey'), {
    handlerTimeout: Infinity
})

const data =
    bot.on(message, async (ctx) => {
        const userMsg = JSON.parse(JSON.stringify(ctx.message))
        // console.log(userMsg)
        let channelMsg = ''

        typeof ctx.message.caption === 'string' ? channelMsg = ctx.message.caption : false
        typeof ctx.message.text === 'string' ? channelMsg = ctx.message.text : false

        const response = await client.responses.create({
            model: GPT_MODEL,
            instructions: PROMPT_1,
            input: channelMsg,
        })
        console.log('🟢 ', '🟢');
        ctx.reply(response.output_text, {
            reply_parameters: {
                message_id: ctx.message.message_id
            }
        })
    })
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))