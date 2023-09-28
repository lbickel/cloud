# Get Started

```
minikube start --cpus=4 --memory=4000 --addons=ingress --mount-string="/run/udev:/run/udev" --mount
```

```
helm repo add openebs https://openebs.github.io/charts
helm repo update
helm install openebs --namespace openebs openebs/openebs --create-namespace
```

```
kubectl apply -f https://raw.githubusercontent.com/reactive-tech/kubegres/v1.16/kubegres.yaml
```

```
skaffold dev
```

```
minikube tunnel
```

Have Fun! :)


# Teil 1 (Pfisterer)

## Zielsetzung
Ziel ist es eine Multi-Tenancy-Anwendung bereitzustellen. Die Applikation soll dazu dienen, Wartungen zu erfassen. Der Benutzer soll relevante Informationen eingeben können, um Wartungsvorgänge für bestimmte Geräte oder Systeme zu dokumentieren. Ziel ist es, die Anwendung möglichst skalierbar zu machen.

## Bestandteile 

- GUI: Es gibt eine grafische Benutzeroberfläche, die dazu dient, dem Benutzer eine Interaktion mit der Anwendung zu ermöglichen.

- Express: Zur Entwicklung der Webanwendung wird Express verwendet. Dabei handelt es sich um ein Framework für Node.js, um Server zu erstellen und Routen zu definieren.

- Datenbanken: Neben der grafischen Benutzeroberfläche gibt es zwei Datenbanken. Die Datenbanken besitzen die folgenden drei Tabellen: Maintenance Objects, Reports und ... Es wird PostgreSQL als realtionales Datenbankmanagementsystem genutzt.

## Architektur

- Docker: Die Containisierungsplattform Docker wird genutzt, um die Datenbanken innerhalb eines Containers zu starten.

- Kubernetes: Das Orchestrierungstool wird genutzt, um die Container zu verwalten.

- Skaffold: Mit diesem Tool wir der Build- und Bereitstellungsprozess der Container automatisiert.

- Prometheus / Grafana: Das Monitoring- und Alarmierungssystem Prometheus wird genutzt, um die Containerumgebung zu überwachen. Grafana kann gut mit Prometheus integriert werden und wird zur Visualisierung genutzt.

  <img src="img/architecture.png" alt="Architektur" width="300"/>

# Teil 2 (Sturm)

## Grundlagen Cloud Native Anwendung

Eine Cloud Native Anwendung zeichnet sich durch fünf wesentliche architektonische Prinzipien aus:
- Microservices: Es werden klein, lose gekoppelte Services entwickelt.
- Dynamic Management: Cloud Resourcen können dynamisch erweitert und reduziert werden.
- Containerisierung: Ist der Prozess des Bündelns einer Anwendung zusammen mit ihrer gesamten Laufzeitumgebung, einschließlich der Abhängigkeiten und Ressourcen, in einen einzigen ausführbaren Container.
- Orechestrierung: Das Container Management erfolgt mithilfe von Software.
- Automation: Aufgaben wie Deployment oder Testing werden automatisiert.

All diese Prinzipien werden von unserer App erfüllt, weshalb es sich um eine Cloud Native Anwendung handelt.S

## Vorteile aus Realisierung als Cloud Native

- Skalierbarkeit und Elastizität: Unsere Anwendung kann flexibel auf wachsende Lasten reagieren. Sie kann durch das Hinzufügen von Instanzen und Resourcen horizontal skaliert werden.

- Flexibilität und Ressourcennutzung: 

- Isolation durch Containisierung: Container garantieren, dass unsere Anwendung in der gleichen Umgebung ausgeführt wird, in der sie entwickelt und getestet wurde. Dadurch werden Probleme vermieden, die durch Unterschiede zwischen Entwicklungs-, Test- und Produktionsumgebungen verursacht werden könnten. Zudem ist die Portabilität gegeben. Das bedeutet, dass die Container problemlos zwischen verschiedenen Infrastrukturen verschoben werden können. Das schnelle Starten von Containern ergöglicht eine agile Bereitstellung der Anwendung. Die Verwaltung und Orchestrierung der Container ist mithilfe von Kubernetes einfach möglich.

- Automatisierung: 

- Erreichbarkeit über Internet: 

## Nachteile aus Realisierung als Cloud Native

- Komplexität der Architektur

- Tests und Debugging

## Alternative Realisierungsmöglichkeiten mit kritischer Erörterung

## Datenschutz

### Gewährleistung der Datensicherheit

### Relevanz der DSGVO

# Autoren
- Laura Bernert
- Linda Bickel
- Sergej Bryan Vizgalov
- Benjamin Wolf
