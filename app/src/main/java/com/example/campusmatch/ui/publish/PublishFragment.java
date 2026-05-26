package com.example.campusmatch.ui.publish;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.example.campusmatch.R;
import com.example.campusmatch.data.MockData;

/**
 * 智能发布 ⭐核心页面 —— 表单填写、AI生成、预览发布
 */
public class PublishFragment extends Fragment {

    private LinearLayout progressLayout;
    private TextView progressText;
    private LinearLayout previewLayout;
    private Handler handler = new Handler(Looper.getMainLooper());

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_publish, container, false);

        progressLayout = view.findViewById(R.id.publish_ai_progress);
        progressText = view.findViewById(R.id.publish_ai_progress_text);
        previewLayout = view.findViewById(R.id.publish_preview);

        // 填充类别网格
        initCategoryGrid(view);
        // 填充成色选项
        initConditionGroup(view);
        // 填充使用时长选项
        initUsageGroup(view);
        // 填充快捷地点标签
        initLocationTags(view);

        // AI建议价格
        view.findViewById(R.id.publish_ai_price_btn).setOnClickListener(v -> {
            EditText et = view.findViewById(R.id.publish_current_price);
            et.setText("45");
            Toast.makeText(getContext(), "AI建议价格：¥35-¥55，已填充中间值", Toast.LENGTH_SHORT).show();
        });

        // AI生成按钮
        view.findViewById(R.id.publish_ai_generate_btn).setOnClickListener(v -> {
            simulateAiGeneration(view);
        });

        // 直接发布
        view.findViewById(R.id.publish_confirm_btn).setOnClickListener(v -> {
            Toast.makeText(getContext(), "发布成功！", Toast.LENGTH_SHORT).show();
            // 隐藏预览、重置表单
            previewLayout.setVisibility(View.GONE);
            progressLayout.setVisibility(View.GONE);
        });

        return view;
    }

    /**
     * 初始化6个分类网格
     */
    private void initCategoryGrid(View view) {
        LinearLayout grid = view.findViewById(R.id.publish_category_grid);
        String[][] categories = MockData.getCategories();
        for (String[] cat : categories) {
            TextView tv = new TextView(getContext());
            tv.setText(cat[0] + "\n" + cat[1]);
            tv.setTextSize(11);
            tv.setTextColor(getResources().getColor(R.color.text_primary, null));
            tv.setGravity(android.view.Gravity.CENTER);
            tv.setBackgroundResource(R.drawable.bg_card_white);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
            params.setMargins(0, 0, 6, 0);
            tv.setLayoutParams(params);
            tv.setPadding(4, 10, 4, 10);
            tv.setOnClickListener(v -> {
                // 选中高亮
                tv.setBackgroundResource(R.drawable.bg_tag_blue);
            });
            grid.addView(tv);
        }
    }

    /**
     * 初始化成色选项组
     */
    private void initConditionGroup(View view) {
        LinearLayout group = view.findViewById(R.id.publish_condition_group);
        String[] conditions = MockData.getConditions();
        for (String c : conditions) {
            TextView tv = createOptionChip(c, group);
            group.addView(tv);
        }
    }

    /**
     * 初始化使用时长选项组
     */
    private void initUsageGroup(View view) {
        LinearLayout group = view.findViewById(R.id.publish_usage_group);
        String[] usages = MockData.getUsageDurations();
        for (String u : usages) {
            TextView tv = createOptionChip(u, group);
            group.addView(tv);
        }
    }

    /**
     * 初始化快捷地点标签
     */
    private void initLocationTags(View view) {
        LinearLayout tagGroup = view.findViewById(R.id.publish_location_tags);
        String[] locations = MockData.getQuickLocations();
        EditText locationEt = view.findViewById(R.id.publish_location);
        for (String loc : locations) {
            TextView tv = new TextView(getContext());
            tv.setText(loc);
            tv.setTextSize(11);
            tv.setTextColor(getResources().getColor(R.color.blue_primary, null));
            tv.setBackgroundResource(R.drawable.bg_tag_blue);
            tv.setPadding(14, 6, 14, 6);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            params.setMargins(0, 0, 8, 0);
            tv.setLayoutParams(params);
            tv.setOnClickListener(v -> locationEt.setText(loc));
            tagGroup.addView(tv);
        }
    }

    /**
     * 创建选项标签
     */
    private TextView createOptionChip(String text, ViewGroup parent) {
        TextView tv = new TextView(getContext());
        tv.setText(text);
        tv.setTextSize(11);
        tv.setTextColor(getResources().getColor(R.color.text_secondary, null));
        tv.setBackgroundResource(R.drawable.bg_card_white);
        tv.setPadding(14, 10, 14, 10);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setMargins(0, 0, 8, 0);
        tv.setLayoutParams(params);
        tv.setOnClickListener(v -> {
            // 选中高亮
            tv.setBackgroundResource(R.drawable.btn_primary_blue);
            tv.setTextColor(getResources().getColor(android.R.color.white, null));
        });
        return tv;
    }

    /**
     * 模拟AI生成流程（2-3秒动画）
     */
    private void simulateAiGeneration(View view) {
        // 显示进度区
        progressLayout.setVisibility(View.VISIBLE);
        previewLayout.setVisibility(View.GONE);

        // 模拟步骤动画
        final String[] steps = {
                "分析商品类别...",
                "评估市场价格...",
                "生成卖点标签...",
                "优化商品描述...",
                "生成完成！"
        };

        for (int i = 0; i < steps.length; i++) {
            final int step = i;
            handler.postDelayed(() -> progressText.setText(steps[step]), i * 500L);
        }

        // 2.5秒后显示预览
        handler.postDelayed(() -> {
            progressLayout.setVisibility(View.GONE);
            showPreview(view);
        }, 2500);
    }

    /**
     * 显示AI生成的预览
     */
    private void showPreview(View view) {
        previewLayout.setVisibility(View.VISIBLE);
        LinearLayout cardContainer = view.findViewById(R.id.publish_preview_card_container);
        cardContainer.removeAllViews();

        // 获取表单数据
        EditText titleEt = view.findViewById(R.id.publish_title);
        EditText priceEt = view.findViewById(R.id.publish_current_price);
        EditText locationEt = view.findViewById(R.id.publish_location);
        String title = titleEt.getText().toString().isEmpty() ? "未命名商品" : titleEt.getText().toString();
        String price = priceEt.getText().toString().isEmpty() ? "?" : priceEt.getText().toString();
        String location = locationEt.getText().toString().isEmpty() ? "未设置" : locationEt.getText().toString();

        // 构建预览卡片
        View card = LayoutInflater.from(getContext())
                .inflate(R.layout.item_product_card, cardContainer, false);

        ((TextView) card.findViewById(R.id.card_product_emoji)).setText("✨");
        ((TextView) card.findViewById(R.id.card_title)).setText("🤖 AI优化: " + title);
        ((TextView) card.findViewById(R.id.card_price)).setText("¥" + price);
        ((TextView) card.findViewById(R.id.card_orig_price)).setText("¥--");
        ((TextView) card.findViewById(R.id.card_saved)).setText("AI定价");
        ((TextView) card.findViewById(R.id.card_location)).setText(location);
        ((TextView) card.findViewById(R.id.card_match_score)).setText("🤖 AI生成 推荐指数 92%");

        LinearLayout tagContainer = card.findViewById(R.id.card_tags_container);
        tagContainer.removeAllViews();
        tagContainer.addView(createTag("AI优化", R.drawable.bg_tag_yellow));
        tagContainer.addView(createTag("智能定价", R.drawable.bg_tag_blue));

        cardContainer.addView(card);
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