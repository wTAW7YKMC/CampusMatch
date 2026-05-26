package com.example.campusmatch.data;

import java.util.ArrayList;
import java.util.List;

/**
 * 智能问答预设数据
 */
public class SmartQA {

    public static class QAItem {
        public String question;
        public String aiReply;

        public QAItem(String question, String aiReply) {
            this.question = question;
            this.aiReply = aiReply;
        }
    }

    public static List<QAItem> getPresetQAs() {
        List<QAItem> qas = new ArrayList<>();
        qas.add(new QAItem("还在吗？",
                "还在的，同学！随时可以联系交易，支持北区宿舍区面交~"));
        qas.add(new QAItem("能便宜点吗？",
                "诚心要的话可以适当优惠，您的心理价位是多少呢？"));
        qas.add(new QAItem("在哪里取货？",
                "可以在北区3号楼楼下或者图书馆门口面交，时间灵活可商量~"));
        qas.add(new QAItem("支持当面验货吗？",
                "当然支持！建议当面验货确认无误后再付款，双方都放心。"));
        qas.add(new QAItem("有发票/购买记录吗？",
                "有的，购买记录和发票都保留着，交易时可以一并提供给您查看~"));
        qas.add(new QAItem("可以预留吗？",
                "可以预留3天，需要您先付10元定金（可退），这样我先把商品下架~"));
        return qas;
    }
}