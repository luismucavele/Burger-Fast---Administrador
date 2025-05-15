-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 15-Maio-2025 às 12:48
-- Versão do servidor: 8.3.0
-- versão do PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `burger_fast`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `clientes`
--

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `celular` varchar(15) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `clientes`
--

INSERT INTO `clientes` (`id`, `nome`, `email`, `criado_em`, `celular`, `endereco`) VALUES
(1, 'Luis Antonio Mucavele', 'mucaveleantonioluis@gmail.com', '2025-04-29 11:48:53', '841188232', 'Bairro de Khongolote, Q.61 Casa 3003 Matola'),
(2, 'Absalome', 'abaslonexavier@gmail.com', '2025-04-29 12:47:06', NULL, NULL),
(3, 'Antonio luis', 'luisantoniomucavele00@gmail.com', '2025-04-29 14:02:47', '872793454', 'Bairro de Khongolote, Q.61 Casa 3003 Matola'),
(4, 'Marcelo das neves', 'macelodasneves@gmail.com', '2025-05-05 17:56:25', NULL, NULL),
(5, 'Absalome Xavier', 'absatutoriais@gmail.com', '2025-05-09 15:48:14', '847600882', 'Polana Caniço A'),
(6, 'Mario Melembe Junior ', 'mariomelembe@gmail.com', '2025-05-13 14:40:19', '874532908', 'polana caniço'),
(7, 'Absalome Xavier', 'absalome@gmai.com', '2025-05-13 17:39:24', '45678766', 'Polana Caniço A, Q23, C170, Rua 3060'),
(8, 'Abslome Xavier', 'abasalomexavier@gmail.com', '2025-05-13 18:32:21', '841188232', 'Matola');

-- --------------------------------------------------------

--
-- Estrutura da tabela `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
CREATE TABLE IF NOT EXISTS `funcionarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `salario` decimal(10,2) NOT NULL,
  `sexo` enum('Masculino','Feminino') NOT NULL,
  `residencia` varchar(255) NOT NULL,
  `nuit` varchar(20) NOT NULL,
  `tipo_funcionario` varchar(50) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `numero_bi` varchar(20) NOT NULL,
  `status` enum('Ativo','Inativo') DEFAULT 'Ativo',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `nuit` (`nuit`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `numero_bi` (`numero_bi`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `funcionarios`
--

INSERT INTO `funcionarios` (`id`, `nome`, `usuario`, `senha`, `salario`, `sexo`, `residencia`, `nuit`, `tipo_funcionario`, `telefone`, `email`, `numero_bi`, `status`, `data_criacao`) VALUES
(1, 'Luis Antonio Mucavele', 'luis', '1234', 12000.00, 'Masculino', 'Maputo', '453563323', 'Gerente', '841188232', 'mucaveleantonioluis@gmail.com', '45678696992B', 'Ativo', '2025-05-01 18:44:16'),
(2, 'Absalone Xavier', 'absa', '12345', 10000.00, 'Masculino', 'Xamanculo', '383832323', 'Atendente', '874352330', 'abasalomexavier@gmail.com', '23452352525B', 'Inativo', '2025-05-03 11:00:20'),
(3, 'Marcelo das Neves', 'marcelo', 'marcelo01', 3000.00, 'Masculino', 'Matola', '214131241', 'Atendente', '874567980', 'marcelodasneves@gmail.com', '27391223345B', 'Ativo', '2025-05-05 17:54:58'),
(4, 'Ana Maria', 'Ana', 'ana2025', 10000.00, 'Feminino', 'Matola', '248567839', 'Recepcionista', '876745098', 'anamaria@gmail.com', '34859403981G', 'Ativo', '2025-05-13 09:01:58');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `funcionario_id` int DEFAULT NULL,
  `data` datetime NOT NULL,
  `status` varchar(30) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `data_entregue` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `funcionario_id` (`funcionario_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `pedidos`
--

INSERT INTO `pedidos` (`id`, `cliente_id`, `funcionario_id`, `data`, `status`, `total`, `data_entregue`) VALUES
(11, 8, NULL, '2025-05-13 20:35:35', 'entregue', 1675.00, '2025-05-13 20:39:55'),
(10, 7, NULL, '2025-05-13 19:47:08', 'entregue', 1395.00, '2025-05-13 19:52:58'),
(9, 1, NULL, '2025-05-13 19:12:35', 'entregue', 1530.00, '2025-05-13 19:12:47'),
(8, 3, NULL, '2025-05-13 19:08:56', 'entregue', 2500.00, '2025-05-13 19:09:02'),
(7, 3, NULL, '2025-05-13 18:56:30', 'entregue', 800.00, '2025-05-13 18:57:26');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedido_itens`
--

DROP TABLE IF EXISTS `pedido_itens`;
CREATE TABLE IF NOT EXISTS `pedido_itens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `produto_nome` varchar(100) NOT NULL,
  `descricao` varchar(200) DEFAULT NULL,
  `preco` decimal(10,2) NOT NULL,
  `quantidade` int NOT NULL,
  `imagem` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `pedido_itens`
--

INSERT INTO `pedido_itens` (`id`, `pedido_id`, `produto_nome`, `descricao`, `preco`, `quantidade`, `imagem`) VALUES
(1, 1, 'Fonte Fresca', '500ml', 30.00, 1, 'http://localhost:3000/uploads/1746800182764.jpg'),
(2, 1, 'Sandes de Ovo com Queijo', 'Pão de leite, ovo cozido, queijo prato, maionese', 85.00, 1, 'http://localhost:3000/uploads/1746798014513.jpg'),
(3, 2, 'Frango Frito Crocante', 'Frango empanado, crocante por fora, suculento por dentro', 400.00, 1, 'http://localhost:3000/uploads/1746795843275.jpg'),
(4, 3, 'Pepsi', '250ml', 70.00, 3, 'http://localhost:3000/uploads/1746801968879.jpg'),
(5, 4, 'Hambúrguer Duplo', 'Pão de fermentação natural, 2x160g carne, queijo prato, maionese', 380.00, 2, 'http://localhost:3000/uploads/1746793919285.jpg'),
(6, 4, 'Fanta Ananás', '500ml', 50.00, 2, 'http://localhost:3000/uploads/1746801628791.jpg'),
(7, 5, 'Coca-Cola', '2L', 120.00, 2, 'http://localhost:3000/uploads/1746802479897.jpg'),
(8, 6, 'Fonte Fresca 500ml', '500ml', 30.00, 2, 'http://localhost:3000/uploads/1746800182764.jpg'),
(9, 6, 'Hambúrguer Duplo', 'Pão de fermentação natural, 2x160g carne, queijo prato, maionese', 380.00, 2, 'http://localhost:3000/uploads/1746793919285.jpg'),
(10, 7, 'Frang Grelhado com Limão', 'Peito de frango grelhado ao molho de limão', 400.00, 2, 'http://localhost:3000/uploads/1746796776037.jpg'),
(11, 8, 'Frango Barbecue', 'Frango assado ao molho barbecue caseiro + batatas', 500.00, 5, 'http://localhost:3000/uploads/1746796043694.jpg'),
(12, 9, 'Pizza de Frango com Catupiry', 'Frango desfiado, catupiry, molho de tomate e queijo', 450.00, 3, 'http://localhost:3000/uploads/1746799162688.jpg'),
(13, 9, 'Coca-Cola Vanilla', '500ml', 60.00, 3, 'http://localhost:3000/uploads/1746801824142.jpg'),
(14, 10, 'Hambúrguer com Bacon', 'Pão brioche, 180g carne, queijo cheddar, bacon, molho especial', 600.00, 2, 'http://localhost:3000/uploads/1746794042856.jpg'),
(15, 10, 'Spar-Letta', '500ml', 50.00, 1, 'http://localhost:3000/uploads/1746802175254.jpg'),
(16, 10, 'Sprite 2L', '2L', 120.00, 1, 'http://localhost:3000/uploads/1746802767811.jpg'),
(17, 10, 'Vumba 500ml', '500ml', 25.00, 1, 'http://localhost:3000/uploads/1746800642903.jpg'),
(18, 11, 'Hambúrguer de Porco Desfiado', 'Pão australiano, carne de porco barbecue, coleslaw', 550.00, 3, 'http://localhost:3000/uploads/1746794140873.jpg'),
(19, 11, 'Namaacha 500ml', '500ml', 25.00, 1, 'http://localhost:3000/uploads/1746800307379.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos`
--

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `preco` decimal(10,2) NOT NULL,
  `estoque` int NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `imagem` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `produtos`
--

INSERT INTO `produtos` (`id`, `nome`, `descricao`, `preco`, `estoque`, `categoria`, `imagem`) VALUES
(3, 'Hambúrguer Duplo', 'Pão de fermentação natural, 2x160g carne, queijo prato, maionese', 380.00, 200, 'hamburguer', '/uploads/1746793919285.jpg'),
(4, 'Hambúrguer com Bacon', 'Pão brioche, 180g carne, queijo cheddar, bacon, molho especial', 600.00, 198, 'hamburguer', '/uploads/1746794042856.jpg'),
(5, 'Hambúrguer de Porco Desfiado', 'Pão australiano, carne de porco barbecue, coleslaw', 550.00, 197, 'hamburguer', '/uploads/1746794140873.jpg'),
(6, 'Hambúrguer Vegetariano', 'Pão integral, hambúrguer de grão de bico, alface, molho iogurte', 400.00, 200, 'hamburguer', '/uploads/1746794227417.png'),
(7, 'Hambúrguer Tradicional', 'Pão macio, 120g carne, cheddar, cebola caramelizada', 500.00, 200, 'hamburguer', '/uploads/1746794331930.jpg'),
(8, 'Hambúrguer com Cogumelos', 'Pão rústico, 150g carne, cogumelos, queijo suíço', 400.00, 200, 'hamburguer', '/uploads/1746794468711.jpg'),
(9, 'Hambúrguer com Queijo Azul', 'Pão de leite, 180g carne, gorgonzola, cebola roxa, rúcula', 700.00, 200, 'hamburguer', '/uploads/1746794584062.jpg'),
(10, 'Hambúrguer de Frango Crocante', 'Pão crocante, frango empanado, maionese de ervas, picles', 450.00, 200, 'hamburguer', '/uploads/1746794641142.jpg'),
(11, 'Hambúrguer Picante', 'Pão com gergelim, 160g carne, queijo apimentado, jalapeños', 550.00, 200, 'hamburguer', '/uploads/1746794709685.jpg'),
(12, 'Hambúrguer Angus Especial', 'Pão premium, 200g carne angus, queijo brie, bacon, rúcula', 950.00, 200, 'hamburguer', '/uploads/1746794804065.jpg'),
(13, 'Hambúrguer Italiano', 'Pão ciabatta, carne bovina, muçarela búfala, tomate seco, pesto', 650.00, 200, 'hamburguer', '/uploads/1746794854098.png'),
(14, 'Hambúrguer com Cebola Doce', 'Pão rústico, 160g carne, queijo suíço, cebolas caramelizadas', 710.00, 200, 'hamburguer', '/uploads/1746794935267.jpg'),
(15, 'Hambúrguer de Americano', 'Pão de batata, filé de peixe empanado, alface, molho tártaro', 550.00, 200, 'hamburguer', '/uploads/1746795039873.jpg'),
(16, 'Hamburguer Suiço', 'Pão integral, 160g carne, cheddar, queijo, tomate', 350.00, 200, 'hamburguer', '/uploads/1746795198811.png'),
(17, 'Hambúrguer Trufado', 'Pão brioche, 200g carne, queijo gruyère, maionese trufada', 900.00, 200, 'hamburguer', '/uploads/1746795303885.jpg'),
(18, 'Hamburguer Tailandês', 'Pão Tailandes, Carne de porco, picanha de peixe, queijo, tomate', 380.00, 200, 'hamburguer', '/uploads/1746795513057.jpg'),
(19, 'Frango Frito Crocante', 'Frango empanado, crocante por fora, suculento por dentro', 400.00, 200, 'frango', '/uploads/1746795843275.jpg'),
(20, 'Frango Grelhado Traficional', 'Peito de frango grelhado, temperado com ervas', 350.00, 200, 'frango', '/uploads/1746795942219.jpg'),
(21, 'Frango Barbecue', 'Frango assado ao molho barbecue caseiro + batatas', 500.00, 195, 'frango', '/uploads/1746796043694.jpg'),
(22, 'Frango Picante', 'Frango frito temperado com pimenta e especiarias + batatas', 430.00, 200, 'frango', '/uploads/1746796097784.jpg'),
(23, 'Asas de Frango ao Molho Buffalo', 'Asinhas fritas ao molho buffalo levemente picante + Batatas', 280.00, 200, 'frango', '/uploads/1746796175484.jpg'),
(24, 'Frango Assado', 'Frango assado banhado com molho de mel e mostarda', 550.00, 200, 'frango', '/uploads/1746796381320.jpg'),
(25, 'Frango Empanado com Parmesão', 'Frango empanado com queijo parmesão ralado + salada', 600.00, 200, 'frango', '/uploads/1746796485053.jpg'),
(26, 'Frango ao Curry', 'Frango cozido em molho de curry suave + batatas', 430.00, 200, 'frango', '/uploads/1746796587094.jpg'),
(27, 'Frango Xadrez', 'Frango em cubos salteado com pimentões e amendoim', 250.00, 200, 'frango', '/uploads/1746796650182.jpg'),
(28, 'Frang Grelhado com Limão', 'Peito de frango grelhado ao molho de limão', 400.00, 198, 'frango', '/uploads/1746796776037.jpg'),
(29, 'Frango Desfiado Especial', 'Frango desfiado temperado com ervas finas', 460.00, 200, 'frango', '/uploads/1746796842275.jpg'),
(30, 'Frango à Milanesa', 'Filé de frango empanado e frito douradinho', 480.00, 200, 'frango', '/uploads/1746796924799.jpg'),
(31, 'Coxa de Frango Assada', 'Coxas temperadas e assadas no forno com alecrim', 700.00, 200, 'frango', '/uploads/1746797038802.jpg'),
(32, 'Frango Tropical com Abacaxi', 'Frango grelhado servido com pedaços de abacaxi fresco', 480.00, 200, 'frango', '/uploads/1746797166392.jpg'),
(33, 'Frango com Queijo e Bacon', 'Filé de frango grelhado com queijo derretido e bacon crocante', 800.00, 200, 'frango', '/uploads/1746797307888.jpg'),
(34, 'Frango ao Molho de Cogumelos', 'Peito de frango grelhado servido com molho cremoso de cogumelos', 800.00, 200, 'frango', '/uploads/1746797414018.jpg'),
(35, 'Sandes De Frango Grelhado', 'Pão baguete, frango grelhado, alface, tomate e maionese caseira', 150.00, 200, 'sandes', '/uploads/1746797587760.jpg'),
(36, 'Sandes Mista', 'Pão de forma, presunto, queijo, manteiga e orégãos', 200.00, 200, 'sandes', '/uploads/1746797694621.jpg'),
(37, 'Sandes de Atum', 'Pão integral, atum, maionese, cenoura ralada e alface', 180.00, 200, 'sandes', '/uploads/1746797846115.jpg'),
(38, 'Sandes de Ovo com Queijo', 'Pão de leite, ovo cozido, queijo prato, maionese', 85.00, 200, 'sandes', '/uploads/1746798014513.jpg'),
(39, 'Sandes Especial de Casa', 'Pão rústico, frango desfiado, queijo derretido, alface e molho especial', 200.00, 200, 'sandes', '/uploads/1746798109809.jpg'),
(40, 'Sandes Premium de Roast Beef', 'Pão ciabatta, roast beef, queijo suíço, rúcula e mostarda dijon', 125.00, 200, 'sandes', '/uploads/1746798186257.jpg'),
(41, 'Batata Frita Clássica', 'Batatas crocantes cortadas fininhas com sal', 85.00, 200, 'batatas', '/uploads/1746798422463.jpg'),
(42, 'Batata Frita com Queijo', 'Batatas fritas cobertas com queijo ralado', 100.00, 200, 'batatas', '/uploads/1746798568035.jpg'),
(43, 'Batata Frita com Bacon', 'Batatas com pedaços de bacon crocante e queijo', 95.00, 200, 'batatas', '/uploads/1746798657651.jpg'),
(44, 'Batata Frita Especial de Casa', 'Batatas rústicas, queijo cheddar, bacon e molho da casa', 150.00, 200, 'batatas', '/uploads/1746798719538.jpg'),
(45, 'Pizza Margherita', 'Molho de tomate, muçarela e manjericão', 400.00, 200, 'pizza', '/uploads/1746798985863.jpg'),
(46, 'Pizza Pepperoni', 'Muçarela, molho de tomate e fatias de pepperoni', 500.00, 200, 'pizza', '/uploads/1746799090986.jpg'),
(47, 'Pizza de Frango com Catupiry', 'Frango desfiado, catupiry, molho de tomate e queijo', 450.00, 197, 'pizza', '/uploads/1746799162688.jpg'),
(48, 'Pizza 4 Queijos', 'Muçarela, gorgonzola, parmesão e queijo prato', 650.00, 200, 'pizza', '/uploads/1746799259244.jpg'),
(49, 'Pizza Portuguesa', 'Presunto, ovo cozido, cebola, azeitona, muçarela e orégãos', 320.00, 200, 'pizza', '/uploads/1746799383765.jpg'),
(50, 'Pizza Vegetariana', 'Tomate, pimentão, cebola, milho, azeitona e muçarela', 380.00, 200, 'pizza', '/uploads/1746799580540.jpg'),
(51, 'Pizza de Atum', 'Atum, cebola roxa, muçarela e azeitonas pretas', 500.00, 200, 'pizza', '/uploads/1746799659123.jpg'),
(52, 'Pizza Calabresa', 'Calabresa fatiada, cebola, orégãos e muçarela', 460.00, 200, 'pizza', '/uploads/1746799701416.jpg'),
(53, 'Piza de Bacon', 'Bacon crocante, molho de tomate, muçarela e orégãos', 280.00, 200, 'pizza', '/uploads/1746799759746.jpg'),
(54, 'Pizza Napolitana', 'Molho de tomate, anchovas, alcaparras, muçarela e azeitonas', 320.00, 200, 'pizza', '/uploads/1746799852990.jpg'),
(55, 'Pizza Suprema da Casa', 'Frango, bacon, calabresa, muçarela, molho especial', 400.00, 200, 'pizza', '/uploads/1746799904395.jpg'),
(56, 'Pizza Premium Especial', 'Camarão, muçarela de búfala, rúcula e molho pesto', 600.00, 200, 'pizza', '/uploads/1746800001729.jpg'),
(57, 'Fonte Fresca 500ml', '500ml', 30.00, 200, 'agua', '/uploads/1746800182764.jpg'),
(58, 'Namaacha 500ml', '500ml', 25.00, 199, 'agua', '/uploads/1746800307379.jpg'),
(59, 'Vumba 500ml', '500ml', 25.00, 199, 'agua', '/uploads/1746800642903.jpg'),
(60, 'Mineral Cristal', '500ml', 30.00, 200, 'agua', '/uploads/1746800724392.jpg'),
(61, 'Bela Fonte', '500ml', 30.00, 200, 'agua', '/uploads/1746800784434.jpg'),
(62, 'Fonte Fresca 1L', '1L', 60.00, 200, 'agua', '/uploads/1746800852123.jpg'),
(63, 'Namaacha 1L', '1L', 70.00, 200, 'agua', '/uploads/1746800985195.jpg'),
(64, 'Aqual Plus 1L', '1L', 60.00, 200, 'agua', '/uploads/1746801040174.jpg'),
(65, 'Vumba 1.5L', '1.5L', 65.00, 200, 'agua', '/uploads/1746801393103.jpg'),
(66, 'Fanta Laranja', '500ml', 50.00, 200, 'refrigerantes', '/uploads/1746801540331.jpg'),
(67, 'Fanta Uva', '500ml', 50.00, 200, 'refrigerantes', '/uploads/1746801583533.jpg'),
(68, 'Fanta Ananás', '500ml', 50.00, 200, 'refrigerantes', '/uploads/1746801628791.jpg'),
(69, 'Coca-Cola', '500ml', 50.00, 198, 'refrigerantes', '/uploads/1746801725494.jpg'),
(70, 'Coca-Cola Zero', '500ml', 55.00, 200, 'refrigerantes', '/uploads/1746801768989.jpg'),
(71, 'Coca-Cola Vanilla', '500ml', 60.00, 197, 'refrigerantes', '/uploads/1746801824142.jpg'),
(72, 'Pepsi', '250ml', 70.00, 200, 'refrigerantes', '/uploads/1746801968879.jpg'),
(73, 'Spar-Letta', '500ml', 50.00, 199, 'refrigerantes', '/uploads/1746802175254.jpg'),
(74, 'Fanta Uva 2L', '2L', 120.00, 200, 'refrigerantes', '/uploads/1746802327516.jpg'),
(75, 'Coca-Cola 2L', '2L', 120.00, 198, 'refrigerantes', '/uploads/1746802479897.jpg'),
(76, 'Fanta Maçã 2L', '2L', 120.00, 200, 'refrigerantes', '/uploads/1746802575941.jpg'),
(77, 'Spar Letta Laranja', '2L', 120.00, 200, 'refrigerantes', '/uploads/1746802670864.jpg'),
(78, 'Sprite 2L', '2L', 120.00, 199, 'refrigerantes', '/uploads/1746802767811.jpg'),
(79, 'Ceres maçã', '1.5L', 100.00, 200, 'sumo', '/uploads/1746802962888.jpg'),
(81, 'Ceres (Papaia e Ananás)', '1.5L', 150.00, 200, 'sumo', '/uploads/1746803495810.jpg'),
(82, 'Ceres (Laranja)', '1.5L', 100.00, 200, 'sumo', '/uploads/1746803579058.jpg'),
(83, 'Ceres (Liche)', '1.5L', 100.00, 200, 'sumo', '/uploads/1746803674698.jpg'),
(84, 'Ceres (Manga e Laranja)', '1.5', 120.00, 200, 'sumo', '/uploads/1746803737330.jpg'),
(85, 'Capy (Laranja)', '250ml', 60.00, 200, 'sumo', '/uploads/1746803848052.jpg'),
(86, 'Ceres (Uva)', '1.5L', 60.00, 200, 'sumo', '/uploads/1746803919266.jpg'),
(87, 'Capy (Manga)', '250ml', 60.00, 200, 'sumo', '/uploads/1746803967999.jpg'),
(90, 'Compal (Maçã)', '200ml', 150.00, 200, 'sumo', '/uploads/1746804209983.jpg'),
(92, 'Compal (Tropical)', '1.5L', 150.00, 200, 'sumo', '/uploads/1746804334036.jpg'),
(93, 'Compal (Pera Rocha)', '1.5L', 150.00, 200, 'sumo', '/uploads/1746804476849.jpg'),
(94, 'Compal (Caju, Manga, Agua de Côco)', '1.5L', 180.00, 200, 'sumo', '/uploads/1746804578389.jpg'),
(95, 'Baunilha', 'Leite, creme de leite, açúcar, gemas de ovo, essência de baunilha', 110.00, 200, 'sorvete', '/uploads/1746804963329.jpg'),
(96, 'Chocolate', 'Leite, creme de leite, açúcar, cacau em pó ou chocolate derretido, gemas de ovo', 120.00, 200, 'sorvete', '/uploads/1746805024719.jpg'),
(97, 'Morango', 'Leite, creme de leite, açúcar, purê de morango (ou morangos frescos), suco de limão (para equilibrar o sabor)', 200.00, 200, 'sorvete', '/uploads/1746805096310.jpg'),
(98, 'Flocos (Tipo Napolitano)', 'Base de creme ou baunilha com flocos de chocolate triturados ou raspas de chocolate', 180.00, 200, 'sorvete', '/uploads/1746805157564.jpg'),
(99, 'Creme', 'Leite, creme de leite, açúcar, gemas de ovo, amido de milho (para textura cremosa)', 130.00, 200, 'sorvete', '/uploads/1746805224258.jpg'),
(100, 'Limão', 'Leite, creme de leite, açúcar, suco e raspas de limão (pode ser feito na versão \"tipo sorbet\" sem leite)', 90.00, 200, 'sorvete', '/uploads/1746805285060.jpg'),
(101, 'Coco', 'Leite, creme de leite, açúcar, leite de coco ou coco ralado', 100.00, 200, 'sorvete', '/uploads/1746805363921.jpg'),
(102, 'Pistache', 'Leite, creme de leite, açúcar, pasta de pistache, corante verde natural (opcional)', 210.00, 200, 'sorvete', '/uploads/1746805456645.jpg'),
(103, 'Menta com Chocolate', 'Leite, creme de leite, açúcar, extrato de menta, gotas ou calda de chocolate', 140.00, 200, 'sorvete', '/uploads/1746805527603.jpg'),
(104, 'Bonaqua 500ml', '500ml', 20.00, 200, 'agua', '/uploads/1747116364125.jpg'),
(106, 'Bonaqua 1L', '1L', 50.00, 200, 'agua', '/uploads/1747116442807.jpg'),
(109, 'Big Burguer', 'pão especial 2 ovos 100g de carne e argolas de cebola, frango, batatas e uma coca-cola', 990.00, 100, 'destaques', '/uploads/1747127385591.jpg'),
(110, '3 Maga Burger\'s', 'pão de humbuguer 300g de carne, molho e batatas fritas', 1000.00, 100, 'destaques', '/uploads/1747129318248.jpg'),
(111, '4 king burgers', 'pão americano, beacon, 100g de carne, cebola, molhos especial', 1200.00, 80, 'destaques', '/uploads/1747129465029.jpg'),
(112, 'Bast Burger', 'pão especial, queijo, 200g de carne e molho', 900.00, 100, 'destaques', '/uploads/1747153263705.jpg'),
(113, 'Hamburguer plus', 'Molho e batata frita', 459.00, 100, 'hamburguer', '/uploads/1747161876692.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `vendas`
--

DROP TABLE IF EXISTS `vendas`;
CREATE TABLE IF NOT EXISTS `vendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int NOT NULL,
  `funcionario_id` int NOT NULL,
  `cliente_id` int NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `data_venda` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `funcionario_id` (`funcionario_id`),
  KEY `cliente_id` (`cliente_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `vendas`
--

INSERT INTO `vendas` (`id`, `pedido_id`, `funcionario_id`, `cliente_id`, `valor`, `data_venda`) VALUES
(14, 2, 0, 1, 1500.00, '2025-02-12 22:05:56'),
(13, 2, 0, 1, 8000.00, '2025-05-10 22:05:56'),
(15, 2, 0, 1, 15000.00, '2025-03-12 22:05:56'),
(16, 2, 0, 1, 2000.00, '2025-05-12 22:05:56'),
(12, 3, 0, 1, 1000.00, '2025-01-10 22:05:56');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
