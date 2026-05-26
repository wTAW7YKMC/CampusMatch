package com.example.campusmatch.data;

import com.example.campusmatch.model.Product;
import com.example.campusmatch.model.Product.MatchReason;
import com.example.campusmatch.model.Product.Seller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Mock数据生成器 —— 生成至少12条商品数据，覆盖6个分类
 */
public class MockData {

    public static List<Product> generateProducts() {
        List<Product> products = new ArrayList<>();

        // ===== 教材类（2条） =====
        products.add(createProduct("prod_001",
                "管理学原理（第13版）｜考研必备教材",
                "教材",
                68.0, 25.0,
                "八成新", "一年内", "北区宿舍", "北区3号楼",
                Arrays.asList("考研必备", "重点已划", "附笔记"),
                "📖",
                new Seller("理工小学霸", 4.9, "👨‍🎓", 15, 8),
                256, 8, 12, "在售", false, true,
                96, 20, 35, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格符合预算（25元 ≤ 30元）", true),
                        new MatchReason("location", "位置便利（北区，距离你200米）", true),
                        new MatchReason("condition", "成色较好（八成新，使用一年）", true),
                        new MatchReason("seller", "卖家信用高（好评率98%）", true)
                )
        ));

        products.add(createProduct("prod_002",
                "高等数学（同济第七版）习题全解",
                "教材",
                45.0, 15.0,
                "七成新", "一年以上", "南区宿舍", "南区5号楼",
                Arrays.asList("考研数学", "习题全解", "经典教材"),
                "📚",
                new Seller("数学达人", 4.7, "🧑‍🏫", 8, 5),
                189, 4, 6, "在售", true, false,
                88, 10, 20, "偏低",
                Arrays.asList(
                        new MatchReason("price", "价格超值（15元，远低于预算）", true),
                        new MatchReason("location", "位置稍远（南区，距离你1.2km）", false),
                        new MatchReason("condition", "成色一般（七成新）", false),
                        new MatchReason("seller", "卖家信用良好（好评率94%）", true)
                )
        ));

        // ===== 电子产品类（2条） =====
        products.add(createProduct("prod_003",
                "蓝牙耳机 AirPods 二代｜九成新正品",
                "电子产品",
                199.0, 89.0,
                "九成新", "半年内", "北区宿舍", "北区1号楼",
                Arrays.asList("正品", "音质好", "续航强"),
                "🎧",
                new Seller("数码控", 4.8, "👨‍💻", 20, 12),
                432, 15, 28, "在售", false, true,
                94, 70, 110, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格合理（89元在市场均价内）", true),
                        new MatchReason("location", "位置便利（北区，距离你300米）", true),
                        new MatchReason("condition", "成色好（九成新，使用半年）", true),
                        new MatchReason("seller", "卖家信用高（好评率96%）", true)
                )
        ));

        products.add(createProduct("prod_004",
                "机械键盘 Cherry红轴｜电竞游戏办公",
                "电子产品",
                349.0, 150.0,
                "八成新", "一年内", "教学楼", "教一楼大厅",
                Arrays.asList("机械键盘", "Cherry轴", "RGB背光"),
                "⌨️",
                new Seller("游戏宅", 4.6, "🎮", 6, 4),
                267, 9, 15, "在售", false, false,
                82, 120, 170, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格适中（150元）", true),
                        new MatchReason("location", "教学楼面交方便", true),
                        new MatchReason("condition", "八成新，Cherry轴耐用", true),
                        new MatchReason("seller", "卖家成交6件，信用良好", true)
                )
        ));

        // ===== 生活用品类（2条） =====
        products.add(createProduct("prod_005",
                "【九成新护眼台灯｜宿舍学习必备】",
                "生活用品",
                89.0, 45.0,
                "九成新", "半年内", "北区宿舍", "北区3号楼",
                Arrays.asList("护眼", "亮度可调", "宿舍必备"),
                "💡",
                new Seller("理工小王子", 5.0, "🤴", 12, 8),
                128, 5, 3, "在售", false, false,
                96, 35, 55, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格符合预算（45元 ≤ 50元）", true),
                        new MatchReason("location", "位置便利（北区，距离你200米）", true),
                        new MatchReason("condition", "成色较好（九成新，使用半年）", true),
                        new MatchReason("seller", "卖家信用高（好评率100%）", true)
                )
        ));

        products.add(createProduct("prod_006",
                "宿舍用小冰箱 迷你冷藏｜夏天必备",
                "生活用品",
                299.0, 120.0,
                "七成新", "一年以上", "南区宿舍", "南区2号楼",
                Arrays.asList("迷你冰箱", "低功耗", "宿舍神器"),
                "🧊",
                new Seller("清凉一夏", 4.5, "🧊", 5, 3),
                389, 18, 22, "在售", false, false,
                78, 100, 140, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格合理（120元）", true),
                        new MatchReason("location", "南区，需要自取", false),
                        new MatchReason("condition", "七成新但功能完好", true),
                        new MatchReason("seller", "卖家好评率90%", true)
                )
        ));

        // ===== 运动器材类（2条） =====
        products.add(createProduct("prod_007",
                "山地自行车 26寸｜校园通勤神器",
                "运动器材",
                899.0, 380.0,
                "八成新", "一年内", "北区宿舍", "北区车棚",
                Arrays.asList("山地车", "26寸", "变速"),
                "🚲",
                new Seller("骑行少年", 4.9, "🚴", 3, 5),
                567, 22, 35, "在售", false, true,
                90, 320, 400, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格合理（380元）", true),
                        new MatchReason("location", "北区车棚面交", true),
                        new MatchReason("condition", "八成新，保养良好", true),
                        new MatchReason("seller", "卖家信用优秀（好评率98%）", true)
                )
        ));

        products.add(createProduct("prod_008",
                "瑜伽垫 加厚防滑｜健身必备",
                "运动器材",
                59.0, 25.0,
                "九成新", "三个月内", "图书馆", "图书馆门口",
                Arrays.asList("加厚", "防滑", "便携"),
                "🧘",
                new Seller("健身达人", 4.8, "💪", 10, 6),
                156, 6, 9, "在售", false, false,
                92, 18, 30, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格实惠（25元）", true),
                        new MatchReason("location", "图书馆面交", true),
                        new MatchReason("condition", "九成新，几乎没用过", true),
                        new MatchReason("seller", "卖家信用高", true)
                )
        ));

        // ===== 服饰鞋包类（2条） =====
        products.add(createProduct("prod_009",
                "NIKE Air Force 1 白色 42码｜仅试穿",
                "服饰鞋包",
                799.0, 350.0,
                "九成新", "三个月内", "北区宿舍", "北区2号楼",
                Arrays.asList("NIKE", "AF1", "仅试穿"),
                "👟",
                new Seller("潮流前线", 4.7, "👔", 7, 5),
                321, 11, 18, "在售", false, true,
                85, 300, 380, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格合理（350元）", true),
                        new MatchReason("location", "北区面交", true),
                        new MatchReason("condition", "仅试穿，九九新", true),
                        new MatchReason("seller", "卖家信用良好", true)
                )
        ));

        products.add(createProduct("prod_010",
                "冬季羽绒服 波司登正品｜保暖轻薄",
                "服饰鞋包",
                599.0, 180.0,
                "八成新", "一年内", "北区宿舍", "北区4号楼",
                Arrays.asList("波司登", "羽绒服", "保暖"),
                "🧥",
                new Seller("温暖同学", 4.6, "🧣", 4, 7),
                198, 7, 5, "在售", true, false,
                76, 150, 200, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格实惠（180元）", true),
                        new MatchReason("location", "北区面交", true),
                        new MatchReason("condition", "八成新，冬季必备", true),
                        new MatchReason("seller", "卖家成交4件", false)
                )
        ));

        // ===== 其他类（2条） =====
        products.add(createProduct("prod_011",
                "吉他 YAMAHA FG800｜入门必备",
                "其他",
                1200.0, 550.0,
                "九成新", "半年内", "教学楼", "艺术楼大厅",
                Arrays.asList("YAMAHA", "民谣吉他", "入门琴"),
                "🎸",
                new Seller("音乐才子", 4.9, "🎵", 6, 3),
                234, 12, 20, "在售", false, true,
                88, 480, 600, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格合理（550元）", true),
                        new MatchReason("location", "艺术楼面交", true),
                        new MatchReason("condition", "九成新，音色完美", true),
                        new MatchReason("seller", "卖家信用优秀", true)
                )
        ));

        products.add(createProduct("prod_012",
                "二手显示器 24寸 Dell 1080P",
                "其他",
                1099.0, 420.0,
                "八成新", "一年内", "南宿舍", "南区8号楼",
                Arrays.asList("Dell", "24寸", "1080P"),
                "🖥️",
                new Seller("码农小明", 4.8, "⌨️", 9, 6),
                345, 14, 16, "在售", false, false,
                84, 380, 450, "合理",
                Arrays.asList(
                        new MatchReason("price", "价格合理（420元）", true),
                        new MatchReason("location", "南区，稍远", false),
                        new MatchReason("condition", "八成新，无坏点", true),
                        new MatchReason("seller", "卖家信用高", true)
                )
        ));

        return products;
    }

    /**
     * 快捷创建商品
     */
    private static Product createProduct(String id, String title, String category,
                                         double origPrice, double curPrice,
                                         String condition, String usage, String loc, String locDetail,
                                         List<String> tags, String emoji,
                                         Seller seller,
                                         int views, int inquiries, int favorites,
                                         String status, boolean urgent, boolean recommended,
                                         int matchScore, double priceMin, double priceMax,
                                         String priceEval, List<MatchReason> reasons) {
        Product p = new Product();
        p.setId(id);
        p.setTitle(title);
        p.setCategory(category);
        p.setOriginalPrice(origPrice);
        p.setCurrentPrice(curPrice);
        p.setCondition(condition);
        p.setUsageDuration(usage);
        p.setLocation(loc);
        p.setLocationDetail(locDetail);
        p.setTags(tags);
        p.setImageEmoji(emoji);
        p.setSeller(seller);
        p.setViewCount(views);
        p.setInquiryCount(inquiries);
        p.setFavoriteCount(favorites);
        p.setStatus(status);
        p.setUrgent(urgent);
        p.setRecommended(recommended);
        p.setAiMatchScore(matchScore);
        p.setAiPriceMin(priceMin);
        p.setAiPriceMax(priceMax);
        p.setAiPriceEvaluation(priceEval);
        p.setAiMatchReasons(reasons);
        return p;
    }

    /**
     * 获取分类列表（emoji + 名称）
     */
    public static String[][] getCategories() {
        return new String[][]{
                {"📚", "教材"},
                {"📱", "电子产品"},
                {"💡", "生活用品"},
                {"🚲", "运动器材"},
                {"👕", "服饰鞋包"},
                {"📦", "其他"}
        };
    }

    /**
     * 获取成色选项
     */
    public static String[] getConditions() {
        return new String[]{"全新", "九成新", "八成新", "七成新", "五成新及以下"};
    }

    /**
     * 获取使用时长选项
     */
    public static String[] getUsageDurations() {
        return new String[]{"三个月内", "半年内", "一年内", "一年以上"};
    }

    /**
     * 获取交易地点快捷标签
     */
    public static String[] getQuickLocations() {
        return new String[]{"北区宿舍", "南区宿舍", "教学楼", "图书馆", "食堂", "快递柜"};
    }
}