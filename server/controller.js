let colorDB = []

let globalID = 0

module.exports = {
    getAllColors: (req,res) => {
        res.status(200).send(colorDB)
    },
    createColor: (req,res) => {
        req.body.id = globalID
        colorDB.push(req.body)
        globalID++
        res.status(200).send(colorDB)
    },
    deleteColor: (req,res) => {
        let { id } = req.params
        let index = colorDB.findIndex(color => color.id === +id)
        colorDB.splice(index,1)
        res.status(200).send(colorDB)
    }
}