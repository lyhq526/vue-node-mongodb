<template>
  <div class="video-form">
    <el-form :model="ruleForm" ref="ruleForm" label-width="200px" :rules="rules">
      <el-form-item label="COOKIE_LOGIN_USER" prop="Cookie">
        <el-input v-model="ruleForm.Cookie" placeholder="请输入COOKIE_LOGIN_USER"></el-input>
      </el-form-item>
      <el-form-item label="SessionKey" prop="SessionKey">
        <el-input v-model="ruleForm.SessionKey" placeholder="请输入SessionKey"></el-input>
      </el-form-item>
      <el-form-item label="Signature" prop="Signature">
        <el-input v-model="ruleForm.Signature" placeholder="请输入Signature"></el-input>
      </el-form-item>
      <el-form-item label="Date" prop="Date">
        <el-input v-model="ruleForm.Date" placeholder="请输入Date"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input v-model="ruleForm.desc" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="server酱" prop="desc">
        <el-input v-model="ruleForm.ftqq" placeholder="请输入server酱密钥"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addPan, selectData,updataPan } from "../../api/index";
export default {
  data() {
    // var validateDate = (rule, value, callback) => {
    //   if(!isNaN(new Date(value).getTime())){
    //     callback()
    //   }else{
    //     callback(new Error("请输入正确Date"));
    //   }

    // };
    return {
      ruleForm: {
        desc: "",
        Cookie: "",
        SessionKey: "",
        ftqq: "",
        Signature: "",
        Date: ""
      }
      // rules: {
      //   Cookie: [{ min:115,max:125, message: '请输入正确COOKIE_LOGIN_USER',trigger: "blur", required: true }],
      //   SessionKey:[{ min:34,max:40,trigger: "blur",message: '请输入正确SessionKey', required: true }],
      //   Signature:[{ min:35,max:42, trigger: "blur",message: '请输入正确Signature', required: true }],
      //   Date: [{ validator: validateDate, trigger: "blur" ,required: true}]
      // }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      selectData({ id: this.$route.query.id }).then(res => {
        if (res.code == 200) {
          this.ruleForm = res.data;
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
      console.log(this.$route.query.id);
    }
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.$route.query.id) {
            addPan(this.ruleForm).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$router.push({ path: "/home" });
              }
            });
          } else {
            updataPan({...this.ruleForm,...{id:this.$route.query.id}}).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$router.push({ path: "/home" });
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.video-form {
  width: 50%;
}
</style>