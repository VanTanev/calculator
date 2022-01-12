import app from './app'
import errorHandler from 'errorhandler'

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler())
}

app.listen(process.env.port || 8080)
