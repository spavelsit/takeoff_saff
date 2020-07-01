const jsonServer = require('json-server')
const auth = require('json-server-auth')

const rules = auth.rewriter({
  // Permission rules
  users: 600,
  contacts: 660,
})

const app = jsonServer.create()
const router = jsonServer.router('db.json')

app.db = router.db

app.use(rules)
app.use(auth)
app.use('/api/v1', router)
app.listen(3000, () => console.log('Server is working'))