import { insertTestUser, initializeTestDb } from './helpers/test.js'
import { expect } from 'chai'
import { getToken } from './helpers/test.js'

const base_url = 'http://localhost:3001'

describe('GET Tasks',() => {
    before(() => {
        initializeTestDb()
    })
    it ('should get all tasks', async() => {
        const response = await fetch(base_url)
        const data =  await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('id','description')
    })
})

describe('POST task',() => {
    const email = 'post@foo.com'
    const password = 'post123'
    insertTestUser(email,password)
    const token = getToken(email)
    it('should post a task',async () => {
        const response = await fetch(base_url + '/create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description':'Task from unit test'})
        })
        const data = await response.json()
        expect(response.status).to.equal(201)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it ('should not post a task without description',async () => {
        const response = await fetch(base_url + '/create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'description':null})
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('DELETE task',() => {
    before(() => {
        initializeTestDb()
    })
    it ('should delete a task',async() => {
        const response = await fetch(base_url + '/delete/1',{
            method: 'delete'
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('array')
        expect(data).to.have.lengthOf(0)
    })

    it ('should not delete a task with SQL injection',async() => {
        const response = await fetch(base_url + '/delete/id=0 or id > 0',{
            method: 'delete'
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})

describe('POST register',() => {
    before(() => {
        initializeTestDb()
    })
    const email = 'register@foo.com'
    const password = 'register123'
    it ('should register with valid email and password',async() => {
        const response = await fetch(base_url + '/user/register',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        })
        const data = await response.json()
        expect(response.status).to.equal(201,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email')

    })
})

describe ('POST login',() => {
    const email = 'login@foo.com'
    const password = 'login123'
    insertTestUser(email,password)
    it ('should login with valid credentials',async() => {
        const response = await fetch(base_url + '/user/login',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        })
        const data = await response.json()
        expect(response.status).to.equal(200,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email','token')
    })
})