package com.example.campusmatch;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.campusmatch.data.MockData;
import com.example.campusmatch.data.SmartQA;
import com.example.campusmatch.model.Product;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 商品详情页
 */
public class ProductDetailActivity extends AppCompatActivity {

    private Map<String, Product> productMap = new HashMap<>();
    private boolean isFavorited = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_product_detail);

        // 构建商品索引
        List<Product> products = MockData.generateProducts();
        for (Product p : products) {
            productMap.put(p.getId(), p);
        }

        // 获取商品ID
        String productId = getIntent().getStringExtra("product_id");
        Product product = productMap.get(productId);
        if (product == null) {
            product = products.get(0); // 默认第一个
        }

        // 填充页面数据
        bindData(product);

        // 加载AI问答
        loadQAList(product);

        // 收藏按钮
        TextView btnFavorite = findViewById(R.id.detail_btn_favorite);
        btnFavorite.setOnClickListener(v -> {
            isFavorited = !isFavorited;
            btnFavorite.setText(isFavorited ? "♥ 已收藏" : "♡ 收藏");
            btnFavorite.setTextColor(isFavorited ?
                    getResources().getColor(R.color.error_red, null) :
                    getResources().getColor(R.color.blue_primary, null));
            Toast.makeText(this, isFavorited ? "已收藏" : "已取消收藏", Toast.LENGTH_SHORT).show();
        });

        // 联系卖家按钮
        findViewById(R.id.detail_contact_btn).setOnClickListener(v ->
                Toast.makeText(this, "已打开联系面板（Demo演示）", Toast.LENGTH_SHORT).show());
    }

    private void bindData(Product p) {
        // emoji
        ((TextView) findViewById(R.id.detail_emoji)).setText(p.getImageEmoji());

        // 标签
        LinearLayout tagsContainer = findViewById(R.id.detail_tags);
        tagsContainer.removeAllViews();
        tagsContainer.addView(createTag(p.getCategory(), R.drawable.bg_tag_blue));
        tagsContainer.addView(createTag(p.getCondition(), R.drawable.bg_tag_blue));
        if (p.isUrgent()) {
            tagsContainer.addView(createTag("急售", R.drawable.bg_tag_yellow));
        }

        // 标题
        ((TextView) findViewById(R.id.detail_title)).setText(p.getTitle());

        // 卖点标签
        LinearLayout sellTags = findViewById(R.id.detail_sell_tags);
        sellTags.removeAllViews();
        for (String tag : p.getTags()) {
            sellTags.addView(createTag(tag, R.drawable.bg_tag_yellow));
        }

        // 价格
        ((TextView) findViewById(R.id.detail_price)).setText("¥" + (int) p.getCurrentPrice());
        ((TextView) findViewById(R.id.detail_orig_price)).setText("¥" + (int) p.getOriginalPrice());
        ((TextView) findViewById(R.id.detail_saved)).setText("省¥" + (int) p.getSavedAmount());

        // AI价格评估
        ((TextView) findViewById(R.id.detail_price_eval)).setText(
                "此定价处于AI建议区间（¥" + (int) p.getAiPriceMin() + "-¥" + (int) p.getAiPriceMax()
                        + "）内，性价比较高");

        // 成交概率
        int successRate = Math.min(95, p.getAiMatchScore() - 1 + (int) (Math.random() * 5));
        ((TextView) findViewById(R.id.detail_success_rate)).setText(
                "预计3天内成交概率: " + successRate + "%");

        // 描述
        ((TextView) findViewById(R.id.detail_description)).setText(
                "这是一件" + p.getCondition() + "的优质" + p.getCategory()
                        + "，使用" + p.getUsageDuration() + "，功能完好。\n\n"
                        + "支持当面验货，确认无误后再付款，双方都放心。\n"
                        + "交易地点：" + p.getLocationDetail() + "。");

        // 参数表
        ((TextView) findViewById(R.id.detail_param_condition)).setText(p.getCondition());
        ((TextView) findViewById(R.id.detail_param_usage)).setText(p.getUsageDuration());
        ((TextView) findViewById(R.id.detail_param_location)).setText(p.getLocationDetail());
        ((TextView) findViewById(R.id.detail_param_views)).setText(String.valueOf(p.getViewCount()));

        // 卖家信息
        Product.Seller seller = p.getSeller();
        ((TextView) findViewById(R.id.detail_seller_avatar)).setText(seller.getAvatarEmoji());
        ((TextView) findViewById(R.id.detail_seller_name)).setText(seller.getNickname());
        ((TextView) findViewById(R.id.detail_seller_publish)).setText("发布" + seller.getPublishCount() + "件");
        ((TextView) findViewById(R.id.detail_seller_sales)).setText("成交" + seller.getSalesCount() + "件");
    }

    /**
     * 加载AI交易问答列表
     */
    private void loadQAList(Product p) {
        LinearLayout qaContainer = findViewById(R.id.detail_qa_container);
        List<SmartQA.QAItem> qaItems = SmartQA.getPresetQAs();

        for (SmartQA.QAItem qa : qaItems) {
            View qaView = LayoutInflater.from(this)
                    .inflate(R.layout.item_qa, qaContainer, false);
            ((TextView) qaView.findViewById(R.id.qa_question)).setText(qa.question);
            ((TextView) qaView.findViewById(R.id.qa_answer)).setText(qa.aiReply);

            // 复制回复
            qaView.findViewById(R.id.qa_btn_copy).setOnClickListener(v -> {
                ClipboardManager clipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                ClipData clip = ClipData.newPlainText("ai_reply", qa.aiReply);
                clipboard.setPrimaryClip(clip);
                Toast.makeText(this, "已复制回复", Toast.LENGTH_SHORT).show();
            });

            // 点击展开/收起回答
            View answerLayout = qaView.findViewById(R.id.qa_answer_layout);
            qaView.findViewById(R.id.qa_question_row).setOnClickListener(v -> {
                answerLayout.setVisibility(
                        answerLayout.getVisibility() == View.VISIBLE ? View.GONE : View.VISIBLE);
            });

            qaContainer.addView(qaView);
        }
    }

    private TextView createTag(String text, int bgRes) {
        TextView tag = new TextView(this);
        tag.setText(text);
        tag.setTextSize(10);
        tag.setTextColor(getResources().getColor(R.color.text_primary, null));
        tag.setBackgroundResource(bgRes);
        tag.setPadding(12, 3, 12, 3);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setMargins(0, 0, 8, 0);
        tag.setLayoutParams(params);
        return tag;
    }
}