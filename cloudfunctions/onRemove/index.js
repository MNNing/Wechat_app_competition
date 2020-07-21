// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log("云函数调用" + event._id)
    return await db.collection("counters").doc(event._id).remove({
    })
  } catch (e) {
    console.error(e)
  }
}