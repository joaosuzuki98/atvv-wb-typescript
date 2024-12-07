import React, { useState, useEffect } from "react";
import Template from "./Template";
import { Card, Table, Row, Col, Spin, Typography } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../services/api";

const { Title } = Typography;

interface Produto {
    id: string;
    nome: string;
    consumoCount: number;
}

interface Cliente {
    id: number;
    nome: string;
    cpf: string;
    genero: string;
    dataEmissaoCPF: string;
    nomeSocial?: string;
    consumoCount?: number;
    valorTotal?: number;
}

interface Servico {
    id: string;
    nome: string;
    consumoCount: number;
}

interface Genero {
    genero: string;
    produtos: Produto[];
    servicos: Servico[];
}

const Analise: React.FC = () => {
    const [topClientes, setTopClientes] = useState<Cliente[]>([]);
    const [menosClientes, setMenosClientes] = useState<Cliente[]>([]);
    const [topProdutosServicos, setTopProdutosServicos] = useState<{ produtos: Produto[]; servicos: Servico[] }>({
        produtos: [],
        servicos: [],
    });
    const [topPorGenero, setTopPorGenero] = useState<Genero[]>([]);
    const [topClientesValor, setTopClientesValor] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnaliseData = async () => {
            setLoading(true);
            try {
                const [clientes, menosClientes, produtosServicos, porGenero, clientesValor] = await Promise.all([
                    api.get("/consumos/top10Clientes"),
                    api.get("/consumos/menos10Clientes"),
                    api.get("/consumos/top5ProdutosServicos"),
                    api.get("/consumos/top5ProdutosServicosPorGenero"),
                    api.get("/consumos/top5ClientesPorValor"),
                ]);

                setTopClientes(clientes.data);
                setMenosClientes(menosClientes.data);
                setTopProdutosServicos(produtosServicos.data);
                setTopPorGenero(porGenero.data);
                setTopClientesValor(clientesValor.data);
            } catch (error) {
                console.error("Erro ao buscar dados de análise:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnaliseData();
    }, []);

    const renderChart = (data: any[], xKey: string, yKey: string, title: string, color: string) => (
        <Card title={title} style={{ marginBottom: 24 }}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey={xKey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={yKey} fill={color} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );

    return (
        <Template title="Análise" subtitle="Analise resultados">
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : (
                <>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            {renderChart(
                                topClientes.map((c: Cliente) => ({
                                    nome: c.nome,
                                    consumoCount: c.consumoCount || 0,
                                })),
                                "nome",
                                "consumoCount",
                                "Top 10 Clientes que mais Consumiram",
                                "#8884d8"
                            )}
                        </Col>

                        <Col xs={24} md={12}>
                            {renderChart(
                                menosClientes.map((c: Cliente) => ({
                                    nome: c.nome,
                                    consumoCount: c.consumoCount || 0,
                                })),
                                "nome",
                                "consumoCount",
                                "10 Clientes que Menos Consumiram",
                                "#82ca9d"
                            )}
                        </Col>

                        <Col xs={24}>
                            <Card title="Top 5 Produtos e Serviços mais Consumidos" style={{ marginBottom: 24 }}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        {renderChart(
                                            topProdutosServicos.produtos.map((p: Produto) => ({
                                                nome: p.nome,
                                                consumoCount: p.consumoCount,
                                            })),
                                            "nome",
                                            "consumoCount",
                                            "Produtos mais Consumidos",
                                            "#ffc658"
                                        )}
                                    </Col>
                                    <Col xs={24} md={12}>
                                        {renderChart(
                                            topProdutosServicos.servicos.map((s: Servico) => ({
                                                nome: s.nome,
                                                consumoCount: s.consumoCount,
                                            })),
                                            "nome",
                                            "consumoCount",
                                            "Serviços mais Consumidos",
                                            "#d0ed57"
                                        )}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24}>
                            <Card title="Top 5 Produtos e Serviços por Gênero">
                                {topPorGenero.map((g: Genero) => (
                                    <div key={g.genero} style={{ marginBottom: 32 }}>
                                        <Title level={4}>{`Gênero: ${g.genero}`}</Title>
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={12}>
                                                {renderChart(
                                                    g.produtos.map((p: Produto) => ({
                                                        nome: p.nome,
                                                        consumoCount: p.consumoCount,
                                                    })),
                                                    "nome",
                                                    "consumoCount",
                                                    "Produtos por Gênero",
                                                    "#8dd1e1"
                                                )}
                                            </Col>
                                            <Col xs={24} md={12}>
                                                {renderChart(
                                                    g.servicos.map((s: Servico) => ({
                                                        nome: s.nome,
                                                        consumoCount: s.consumoCount,
                                                    })),
                                                    "nome",
                                                    "consumoCount",
                                                    "Serviços por Gênero",
                                                    "#a4de6c"
                                                )}
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                            </Card>
                        </Col>

                        <Col xs={24}>
                            {renderChart(
                                topClientesValor.map((c: Cliente) => ({
                                    nome: c.nome,
                                    valorTotal: c.valorTotal || 0,
                                })),
                                "nome",
                                "valorTotal",
                                "Top 5 Clientes por Valor Consumido",
                                "#ff7300"
                            )}
                        </Col>
                    </Row>
                </>
            )}
        </Template>
    );
};

export default Analise;
