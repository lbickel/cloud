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
Es soll eine Multi-Tenancy-Anwendung bereitgestellt werden, um Wartungen an Systemen und Geräten zu dokumentieren. Hierzu können die Systeme und Geräte als Wartungsobjekte angelegt werden. Zudem können pro Jahr Berichte erstellt werden, welche durch ihre Jahreszahl identifiziert werden und alle durchgeführten Wartungen beinhalten. Zu jedem jährlichen Bericht kann der Nutzer neue Wartungen hinzufügen. Ziel ist es, die Anwendung möglichst skalierbar zu gestalten. Kunden der Anwendungen könnten jegliche Unternehmen sein, welche Wartungen durchführen müssen. Die Idee der Anwendung stammt aus der Branche der Gebäudeautomatisierung, da hier besonders häufig Wartungen vorgenommen werden müssen.

## Bestandteile 

- GUI mit Bootstrap: Es gibt eine grafische Benutzeroberfläche, die dazu dient, dem Benutzer die Interaktion mit der Anwendung zu ermöglichen. Mithilfe der GUI kann der Benutzer Wartungsobjekte und Berichte verwalten sowie Wartungen hinzufügen. Für die Umsetzung der Benutzeroberfläche wird das Framework Bootstrap genutzt.

- Express: Zur Entwicklung der Webanwendung wird Express verwendet. Dabei handelt es sich um ein Framework für Node.js, um Server zu erstellen und Routen zu definieren.

- Datenbanken: Neben der grafischen Benutzeroberfläche gibt es mehrere Datenbanken. Die Datenbanken besitzen jeweils die folgenden drei Tabellen: Maintenance Object, Maintenance Report und Maintenance Report Entry. Es wird PostgreSQL als relationales Datenbankmanagementsystem genutzt.

## Architektur

- Docker: Die Containerisierungsplattform Docker wird genutzt, um die Datenbanken innerhalb eines Containers zu starten. Auch die GUI und die Monitoringsysteme werden jeweils in einem gesonderten Container gestartet.

- Kubernetes: Das Orchestrierungstool wird genutzt, um die verschiedenen Container zu verwalten.

- Skaffold: Mit diesem Tool wir der Build- und Bereitstellungsprozess der Container automatisiert.

- Prometheus / Grafana: Das Monitoring- und Alarmierungssystem Prometheus wird genutzt, um die Containerumgebung zu überwachen. Grafana kann gut mit Prometheus integriert werden und wird zur Visualisierung genutzt.

  <img src="img/architecture.png" alt="Architektur" width="300"/>

## High-Available Postgres DB

Wie bereits geschrieben, gibt es mehrere Datenbanken, da es sich um eine Multi-Tenancy Anwendung handelt. Pro Tenant gibt es eine Datenbank, wie aus dem Architektur Schaubild hervorgeht. Da wir es uns zur Aufgabe gemacht haben, eine möglichst skalierbare Anwendung bereit zu stellen, war die skalierbare Postgres eine Herausforderung. In jeder bereitgestellten Ressource in Kubernetes, müssen dieselben Daten zu jedem Zeitpunkt verfügbar sein. Um dieses Ziel zu erreichen, arbeiten wir mit dem Postgres Operator Kubegres (https://www.kubegres.io/doc/getting-started.html). Dafür wird ein Kubernetes Objekt vom Typ Kubegres konfiguriert, welches mit einem Secret und einer ConfigMap arbeitet. Diese Ressourcen haben wir ebenfalls konfiguriert. Mit diesem Lösungsansatz ist es uns gelungen, eine konsistente und persistente Postgres über mehrere Replicas hinweg zur Verfügung zu stellen.

# Teil 2 (Sturm)

## Grundlagen Cloud Native Anwendung

Eine Cloud Native Anwendung zeichnet sich durch fünf wesentliche architektonische Prinzipien aus:
- Microservices: Es werden kleine, lose gekoppelte Services entwickelt. Die Services kommunizieren mithilfe von Schnittstellen miteinander.
- Dynamic Management: Cloud Ressourcen können dynamisch erweitert und reduziert werden.
- Containerisierung: Das ist der Prozess des Bündelns einer Anwendung zusammen mit ihrer gesamten Laufzeitumgebung, einschließlich der Abhängigkeiten und Ressourcen, in einen einzigen ausführbaren Container.
- Orchestrierung: Das Container Management erfolgt mithilfe von Software.
- Automation: Aufgaben wie Deployment oder Testing werden automatisiert.

All diese Prinzipien werden von unserer App erfüllt, weshalb es sich um eine Cloud Native Anwendung handelt.

## Vorteile aus Realisierung als Cloud Native

- Skalierbarkeit und Ressourcennutzung: Unsere Anwendung kann flexibel auf wachsende Lasten reagieren. Sie kann durch das Hinzufügen von Datenbank-Instanzen sowie Servern für das Frontend horizontal skaliert werden. Auf diese Weise ist eine effiziente Nutzung der Ressourcen möglich.

- Isolation und Portabilität: Die Container garantieren, dass unsere Anwendung in der gleichen Umgebung ausgeführt wird, in der sie entwickelt und getestet wurde. Dadurch werden Probleme vermieden, die durch Unterschiede zwischen Entwicklungs-, Test- und Produktionsumgebungen verursacht werden könnten. Zudem ist die Portabilität gegeben. Das bedeutet, dass die Container problemlos zwischen verschiedenen Infrastrukturen verschoben werden können. Das schnelle Starten von Containern ermöglicht eine agile Bereitstellung der Anwendung. Die Verwaltung und Orchestrierung der Container ist mithilfe von Kubernetes einfach möglich.

- Automatisierung: Die Cloud Native Anwendung ermöglicht eine automatisierte Bereitstellung, Wartung und Verwaltung. Durch Continous Integration (CI) und Continous Deployment (CD) Prozesse können Updates und Releases schnell und zuverlässig durchgeführt werden.

- Erreichbarkeit über Internet: Die Anwendung kann über das Internet einfach zugänglich gemacht werden. Durch den Einsatz von Load-Balancing und Reverse-Proxies können Anfragen effizient verteilt und die Verfügbarkeit der Anwendung verbessert werden.

- Monitoring: Die Monitoring-Tools Prometheus und Grafana ermöglichen, die Überwachung von Protokollen, Metriken und der Performance. Das führt dazu, dass Probleme frühzeitig erkannt und schnell behoben werden können.

- Resilienz und Ausfallsicherheit: Cloud Native Anwendungen sind darauf ausgelegt, Ausfälle zu minimieren und sich schnell zu erholen. Durch die Verwendung von Redundanz, automatischer Skalierung und Fehlertoleranzmechanismen kann unsere Anwendungen noch widerstandsfähiger gegenüber Störungen gemacht werden.

## Nachteile aus Realisierung als Cloud Native

- Komplexität der Architektur: Unsere Cloud Native Anwendung weist aufgrund der Verwendung von Docker und Kubernetes eine erhöhte Komplexität der Architektur auf.

- Tests und Debugging: Die Test- und Debugging-Prozesse können komplizierter werden, da Cloud Native Anwendungen aus mehreren unabhängigen Komponenten bestehen. Es kann schwieriger sein, die Interaktionen zwischen den einzelnen Komponenten zu verstehen.

- Abhängigkeit von Netzwerk: Cloud Native Anwendungen sind stark von der Zuverlässigkeit des Netzwerks abhängig. Eine schlechte Netzwerkverbindung oder Netzwerkprobleme können die Leistung und Verfügbarkeit der Anwendung beeinträchtigen.

- Kosten: Obwohl Cloud-native Ansätze eine effiziente Ressourcennutzung ermöglichen, kann es dennoch zu Kostensteigerungen kommen, wenn Ressourcen nicht richtig verwaltet werden. Es ist wichtig, die Kosten im Auge zu behalten und geeignete Kontrollmechanismen zu implementieren.

- Vendor Lock-In: Bei der Nutzung von Cloud-Plattformen und spezifischen Diensten besteht die Gefahr des Vendor Lock-Ins. Das bedeutet, dass es schwierig sein kann, zu einer anderen Cloud-Plattform zu wechseln, wenn die Anwendung stark an die spezifischen Dienste des aktuellen Anbieters gebunden ist.

## Alternative Realisierungsmöglichkeiten mit kritischer Erörterung

Es wäre auch denkbar, die Anwendung mit einem Backend- und einem Frontend-Server zu bauen und keine Container zu nutzen. Auf diese Weise wäre die Architektur deutlich einfacher gewesen. Das Problem wäre allerdings gewesen, dass die Anwendung nicht skalierbar gewesen wäre. Falls die Anwendung irgendwann von einer Vielzahl an Kunden genutzt wird und die Server Lastspitzen erreichen, ist eine Erweiterung der Ressourcen nicht einfach möglich. Das könnte dazu führen, dass Kunden abspringen und es zu Geldeinbußen aufgrund der fehlenden Skalierbarkeit kommt. Zudem könnte es bei einer fehlenden Containerisierung zu Portabilitätsproblemen kommen. Auch die Wartung und das Einspielen von Updates ist deutlich erschwert.

## Gewährleistung des Datenschutzes und der Datensicherheit

Häufig werden in Cloud Native Anwendungen personenbezogene Daten gesammelt und verwendet, die bei einem Cloud-Anbieter im Rechenzentrum abliegen. Der Cloud-Anbieter hat somit physischen Zugriff auf die Server, auf denen die Daten gespeichert sind. Dies kann Bedenken hinsichtlich der Kontrolle über die Daten und der möglichen Offenlegung vertraulicher Informationen aufwerfen.

Es ist wichtig zu verstehen, wie der Cloud-Anbieter mit den gespeicherten Daten umgeht. Unterschiedliche Länder und Regionen haben unterschiedliche Datenschutzgesetze und -vorschriften. Es ist wichtig sicherzustellen, dass der Cloud-Anbieter die erforderlichen rechtlichen Anforderungen erfüllt, insbesondere wenn es um die Speicherung und Verarbeitung sensibler Daten geht.

In unserer Anwendung werden als personenbezogene Daten nur der Name der Person, welche die Wartung durchgeführt hat, verwaltet. Hierfür ist die DSGVO relevant. Allerdings ist im Fall der Anwendung zur Verwaltung von Wartungen der Datenschutz und die Datensicherheit nicht als besonders kritisch zu betrachten. Interessant wird es nur, wenn Unternehmen die Anwendung nutzen möchten, welche streng geheime Systeme und Geräte verwalten. Für diese Unternehmen ist die Cloud Native Anwendung ungeeignet.

# Autoren
- Laura Bernert
- Linda Bickel
- Sergej Bryan Vizgalov
- Benjamin Wolf