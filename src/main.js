import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { Loader } from './loader.js'
import OpenAI from 'openai'
import config from 'config'

const GPT_MODEL = 'gpt-4o'
const PROMPT_1 = 'Сделай выжимку и вывод. Если контекcт про экономику, дополнительно дай оценку, положительно или отрицательно это влияет на криптовалюты'
const client = new OpenAI({
    apiKey: config.get('OPENAI_API_KEY'), // This is the default and can be omitted
});
const bot = new Telegraf(config.get('apiKey'), {
    handlerTimeout: Infinity
})


bot.on(message, async (ctx) => {
    const userMsg = JSON.parse(JSON.stringify(ctx.message))
    // console.log(userMsg)
    let channelMsg = ''

    typeof ctx.message.caption === 'string' ? channelMsg = ctx.message.caption : false
    typeof ctx.message.text === 'string' ? channelMsg = ctx.message.text : false
    const loader = new Loader(ctx)
    loader.show()
    // ctx.reply('👀')

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