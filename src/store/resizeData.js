// サイズ調整のデータ
import axios from "axios";

class ResizeData {
  static uuid = null;
  static setUUID(uuid) {
    this.uuid = uuid;
  }
  static send(msg, params = {}) {
    const data = {
      uuid: this.uuid,
      message: msg,
      params: params,
      timestamp: new Date().getTime(),
    }
    // console.log(data.message, data.params);
    axios.post('https://miyama.nkmr.io/kanaya_selection/api/send.php', data).then((res) => {
      // console.log(res.data);
    }).catch((err) => {
      // console.log(err);
    });
  }
}

export default ResizeData;