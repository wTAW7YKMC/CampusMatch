package com.example.campusmatch.ui.match;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.campusmatch.ProductDetailActivity;
import com.example.campusmatch.R;
import com.example.campusmatch.data.MockData;
import com.example.campusmatch.model.Product;

import java.util.ArrayList;
import java.util.List;

/**
 * 智能匹配 ⭐核心页面 —— 自然语言需求输入、AI匹配推荐
 */
public class MatchFragment extends Fragment {

    private EditText inputEt;
    private LinearLayout resultArea;
    private LinearLayout productContainer;
    private TextView resultCountTv;
    private LinearLayout parsedTags;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_match, container, false);

        inputEt = view.findViewById(R.id.match_input);
        resultArea = view.findViewById(R.id.match_result_area);
        productContainer = view.findViewById(R.id.match_product_container);
        resultCountTv = view.findViewById(R.id.match_result_count);
        parsedTags = view.findViewById(R.id.match_parsed_tags);

        // 示例标签点击填充
        setupExampleTags(view);

        // 开始匹配
        view.findViewById(R.id.match_start_btn).setOnClickListener(v -> performMatch());

        return view;
    }

    /**
     * 设置示例标签点击
     */
    private void setupExampleTags(View view) {
        int[] exampleIds = {R.id.match_example_1, R.id.match_example_2, R.id.match_example_3};
        String[] examples = {
                "我想买一本管理学教材，预算30元以内，最好在北区",
                "护眼台灯，九成新，北区优先",
                "蓝牙耳机，预算100左右"
        };
        for (int i = 0; i < exampleIds.length; i++) {
            final String text = examples[i];
            view.findViewById(exampleIds[i]).setOnClickListener(v -> inputEt.setText(text));
        }
    }

    /**
     * 执行智能匹配
     */
    private void performMatch() {
        String query = inputEt.getText().toString().trim();
        if (query.isEmpty()) {
            // 即使为空也模拟匹配，展示所有商品
            query = "全部商品";
        }

        // 解析需求关键词
        List<String> parsedKeywords = parseQuery(query);

        // 显示解析标签
        parsedTags.removeAllViews();
        for (String kw : parsedKeywords) {
            TextView tag = new TextView(getContext());
            tag.setText(kw);
            tag.setTextSize(11);
            tag.setTextColor(getResources().getColor(R.color.blue_primary, null));
            tag.setBackgroundResource(R.drawable.bg_tag_blue);
            tag.setPadding(12, 5, 12, 5);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            params.setMargins(0, 0, 8, 0);
            tag.setLayoutParams(params);
            parsedTags.addView(tag);
        }

        // 模拟匹配结果（取前几条商品并根据需求调整匹配分数）
        List<Product> allProducts = MockData.generateProducts();
        List<Product> matched = new ArrayList<>();
        for (Product p : allProducts) {
            // 简单关键词匹配
            boolean matches = query.contains("全部") ||
                    query.contains(p.getCategory()) ||
                    query.contains(p.getTitle().substring(0, Math.min(4, p.getTitle().length()))) ||
                    allProducts.size() <= 6;  // 确保至少返回一些结果
            if (matches) {
                // 根据需求调整匹配分数
                int adjustedScore = p.getAiMatchScore();
                if (query.contains("教材")) {
                    adjustedScore = p.getCategory().equals("教材") ? adjustedScore : adjustedScore - 20;
                }
                if (query.contains("北区")) {
                    adjustedScore = p.getLocation().contains("北区") ? adjustedScore + 5 : adjustedScore - 15;
                }
                if (query.contains("30")) {
                    adjustedScore = p.getCurrentPrice() <= 30 ? adjustedScore + 10 : adjustedScore - 10;
                }
                if (query.contains("九成新")) {
                    adjustedScore = "九成新".equals(p.getCondition()) ? adjustedScore + 8 : adjustedScore - 5;
                }
                p.setAiMatchScore(Math.max(50, Math.min(99, adjustedScore)));
                matched.add(p);
            }
        }

        // 确保至少返回3个结果
        if (matched.isEmpty()) {
            matched = allProducts.subList(0, Math.min(4, allProducts.size()));
        }

        // 按匹配度降序排序
        matched.sort((a, b) -> Integer.compare(b.getAiMatchScore(), a.getAiMatchScore()));

        // 显示结果
        resultCountTv.setText("找到 " + matched.size() + " 件匹配商品");
        productContainer.removeAllViews();

        for (Product p : matched) {
            View card = createMatchCard(p);
            productContainer.addView(card);
        }

        resultArea.setVisibility(View.VISIBLE);
    }

    /**
     * 解析需求（简单关键词提取）
     */
    private List<String> parseQuery(String query) {
        List<String> keywords = new ArrayList<>();
        if (query.contains("教材") || query.contains("管理学")) keywords.add("📚 品类:教材");
        if (query.contains("电子产品") || query.contains("耳机") || query.contains("蓝牙")) keywords.add("📱 品类:电子产品");
        if (query.contains("台灯") || query.contains("生活")) keywords.add("💡 品类:生活用品");
        if (query.contains("30")) keywords.add("💰 预算:≤30元");
        if (query.contains("100")) keywords.add("💰 预算:≤100元");
        if (query.contains("北区")) keywords.add("📍 位置:北区");
        if (query.contains("九成新")) keywords.add("⭐ 成色:九成新");
        if (keywords.isEmpty()) keywords.add("🔍 智能综合匹配");
        return keywords;
    }

    /**
     * 创建匹配结果卡片（带匹配理由）
     */
    private View createMatchCard(Product p) {
        View card = LayoutInflater.from(getContext())
                .inflate(R.layout.item_product_card, productContainer, false);

        ((TextView) card.findViewById(R.id.card_product_emoji)).setText(p.getImageEmoji());

        LinearLayout tagContainer = card.findViewById(R.id.card_tags_container);
        tagContainer.removeAllViews();
        if (p.isUrgent()) {
            tagContainer.addView(createTag("急售", R.drawable.bg_tag_yellow));
        }
        tagContainer.addView(createTag(p.getCategory(), R.drawable.bg_tag_blue));
        tagContainer.addView(createTag(p.getCondition(), R.drawable.bg_tag_blue));

        ((TextView) card.findViewById(R.id.card_title)).setText(p.getTitle());
        ((TextView) card.findViewById(R.id.card_price)).setText("¥" + (int) p.getCurrentPrice());
        ((TextView) card.findViewById(R.id.card_orig_price)).setText("¥" + (int) p.getOriginalPrice());
        ((TextView) card.findViewById(R.id.card_saved)).setText("省¥" + (int) p.getSavedAmount());
        ((TextView) card.findViewById(R.id.card_location)).setText(p.getLocation());
        ((TextView) card.findViewById(R.id.card_match_score)).setText(
                "🤖 AI匹配度 " + p.getAiMatchScore() + "%");

        // 添加匹配理由
        LinearLayout parent = (LinearLayout) card;
        LinearLayout reasonContainer = new LinearLayout(getContext());
        reasonContainer.setOrientation(LinearLayout.VERTICAL);
        reasonContainer.setPadding(0, 6, 0, 0);

        for (Product.MatchReason reason : p.getAiMatchReasons()) {
            TextView reasonTv = new TextView(getContext());
            reasonTv.setText((reason.isMatched() ? "✅ " : "❌ ") + reason.getText());
            reasonTv.setTextSize(11);
            reasonTv.setTextColor(reason.isMatched() ?
                    getResources().getColor(R.color.success_green, null) :
                    getResources().getColor(R.color.text_hint, null));
            reasonTv.setPadding(0, 2, 0, 2);
            reasonContainer.addView(reasonTv);
        }
        parent.addView(reasonContainer,
                new LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        card.setOnClickListener(v -> {
            Intent intent = new Intent(getActivity(), ProductDetailActivity.class);
            intent.putExtra("product_id", p.getId());
            startActivity(intent);
        });

        return card;
    }

    private TextView createTag(String text, int bgRes) {
        TextView tag = new TextView(getContext());
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